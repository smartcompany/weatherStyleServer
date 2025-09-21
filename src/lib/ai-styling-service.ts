import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Weather } from '@/types/weather';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Supabase 클라이언트 초기화 (환경 변수 체크)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface StylingRequest {
  imageUrl: string;
  weather: Weather;
  stylePreset: 'casual' | 'smart_casual' | 'date' | 'outdoor' | 'business';
  colorPreferences?: string[];
  bodyNotes?: string;
}

export interface StylingResponse {
  imageUrl: string;
  style: string;
  weatherTag: string;
  palette: string[];
  materials: string[];
  outfitSummary: string;
  items: OutfitItem[];
  whyItWorks: string[];
  careTips: string[];
  alternatives: Alternative[];
}

export interface OutfitItem {
  category: string;
  name: string;
  color: string;
  fit: string;
  notes: string;
}

export interface Alternative {
  swap: string;
  when: string;
}

export class AIStylingService {
  private async getPrompts(): Promise<{ systemPrompt: string; userPrompt: string }> {
    // Supabase가 설정되지 않은 경우 에러 반환
    if (!supabase) {
      throw new Error('Supabase 설정이 필요합니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_KEY를 설정해주세요.');
    }

    try {
      // Supabase Storage에서 프롬프트 파일들 다운로드
      const { data: systemPromptData } = await supabase.storage
        .from(process.env.STORAGE_BUCKET || 'prompts')
        .download('cody-system-prompt.txt');

      const { data: userPromptData } = await supabase.storage
        .from(process.env.STORAGE_BUCKET || 'prompts')
        .download('cody-user-prompt.txt');

      if (!systemPromptData || !userPromptData) {
        throw new Error('프롬프트 파일을 찾을 수 없습니다.');
      }

      const systemPrompt = await systemPromptData.text();
      const userPrompt = await userPromptData.text();

      return { systemPrompt, userPrompt };
    } catch (error) {
      console.error('프롬프트 로드 실패:', error);
      throw new Error(`프롬프트 로드 실패: ${error}`);
    }
  }

  async generateStyleRecommendation(request: StylingRequest): Promise<StylingResponse> {
    try {
      // 1. 프롬프트 로드
      const { systemPrompt, userPrompt } = await this.getPrompts();

      // 2. 사용자 프롬프트에 실제 데이터 삽입
      const populatedUserPrompt = this.populatePromptTemplate(userPrompt, request);

      // 3. OpenAI API 호출
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: populatedUserPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: request.imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      // 4. 응답 파싱
      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('AI 응답을 받지 못했습니다.');
      }

      // JSON 파싱
      const stylingResult = JSON.parse(responseText) as StylingResponse;
      
      // 5. 생성된 이미지 Supabase에 저장 (선택사항)
      // await this.saveGeneratedImage(stylingResult.imageUrl);

      return stylingResult;
    } catch (error) {
      console.error('AI 스타일링 오류:', error);
      throw new Error(`AI 스타일링 실패: ${error}`);
    }
  }

  private populatePromptTemplate(template: string, request: StylingRequest): string {
    const now = new Date();
    const location = `${request.weather.location}, KR`;
    const datetime = now.toISOString().slice(0, 16);
    
    return template
      .replace('{IMAGE_URL}', request.imageUrl)
      .replace('{CITY_COUNTRY}', location)
      .replace('{YYYY-MM-DDTHH:mm}', datetime)
      .replace('{NUMBER}', request.weather.temperature.toString())
      .replace('{STRING}', request.weather.description)
      .replace('{STYLE_PRESET}', `"${request.stylePreset}"`)
      .replace('{COLOR_PREFERENCES}', JSON.stringify(request.colorPreferences || null))
      .replace('{BODY_NOTES}', JSON.stringify(request.bodyNotes || null));
  }

  async uploadImageToSupabase(imageBase64: string, fileName: string): Promise<string> {
    // Supabase가 설정되지 않은 경우 에러 반환
    if (!supabase) {
      throw new Error('Supabase 설정이 필요합니다. 이미지 업로드를 위해 Supabase Storage를 설정해주세요.');
    }

    try {
      // Base64를 Buffer로 변환
      const buffer = Buffer.from(imageBase64, 'base64');
      
      // Supabase Storage에 업로드
      const { data, error } = await supabase.storage
        .from(process.env.STORAGE_BUCKET || 'prompts')
        .upload(`user-photos/${fileName}`, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        throw new Error(`이미지 업로드 실패: ${error.message}`);
      }

      // 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from(process.env.STORAGE_BUCKET || 'prompts')
        .getPublicUrl(`user-photos/${fileName}`);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Supabase 업로드 오류:', error);
      throw new Error(`이미지 업로드 실패: ${error}`);
    }
  }

  private async saveGeneratedImage(imageUrl: string): Promise<void> {
    try {
      // 생성된 이미지를 Supabase에 저장하는 로직 (선택사항)
      console.log('생성된 이미지 저장:', imageUrl);
    } catch (error) {
      console.error('생성된 이미지 저장 실패:', error);
    }
  }

  // 더미 응답 (API 키 없을 때)
  getDummyStylingResponse(): StylingResponse {
    return {
      imageUrl: 'https://example.com/styled-photo.jpg',
      style: 'casual',
      weatherTag: 'mild, clear',
      palette: ['navy', 'white', 'beige'],
      materials: ['cotton', 'denim', 'canvas'],
      outfitSummary: '현재 날씨에 적합한 캐주얼 룩으로, 편안하면서도 세련된 스타일을 연출했습니다.',
      items: [
        {
          category: 'top',
          name: '코튼 크루넥 티셔츠',
          color: 'white',
          fit: 'regular',
          notes: '통기성 좋은 면 소재'
        },
        {
          category: 'bottom',
          name: '슬림핏 청바지',
          color: 'navy',
          fit: 'slim',
          notes: '편안한 스트레치 데님'
        }
      ],
      whyItWorks: [
        '현재 온도에 적합한 가벼운 소재',
        '깔끔한 색상 조합으로 세련된 느낌'
      ],
      careTips: [
        '면 소재는 찬물 세탁 권장',
        '직사광선 피해 그늘에서 건조'
      ],
      alternatives: [
        {
          swap: 'top → 긴팔 셔츠',
          when: '온도가 5도 이상 낮아질 때'
        }
      ]
    };
  }
}
