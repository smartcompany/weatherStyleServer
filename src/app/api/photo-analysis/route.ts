import { NextRequest, NextResponse } from 'next/server';
import { AIStylingService, StylingRequest } from '@/lib/ai-styling-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 이미지 파일 또는 URL
    const imageFile = formData.get('image') as File | null;
    const imageUrl = formData.get('imageUrl') as string | '';
    const location = formData.get('location') as string || '';
    
    // 스타일 정보
    const stylePreset = formData.get('stylePreset') as string || 'casual';
    const recommendedItems = formData.get('recommendedItems') as string || '';
    
    // 날씨 정보 요약 문자열
    const weatherSummary = formData.get('weatherSummary') as string || '';
    
    // 사용자 설정
    const preferredLanguage = formData.get('preferredLanguage') as string || 'en';

    // 필수 데이터 검증
    if (!imageFile && !imageUrl) {
      return NextResponse.json(
        { error: 'Image file or URL is required' },
        { status: 400 }
      );
    }

    if (!weatherSummary) {
      return NextResponse.json(
        { error: 'Weather summary is required' },
        { status: 400 }
      );
    }

    const aiStylingService = new AIStylingService();

    try {
      let finalImageUrl = imageUrl;
      
      if (!imageUrl && imageFile) {
        // 이미지 파일을 Supabase에 업로드
        const fileName = `user-photo-${Date.now()}.jpg`;
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imageBase64 = imageBuffer.toString('base64');
        finalImageUrl = await aiStylingService.uploadImageToSupabase(
          imageBase64,
          fileName
        );
      }

      // 3. AI 스타일링 요청 생성
      const validStylePresets = ['casual', 'smart_casual', 'date', 'outdoor', 'business'] as const;
      const validatedStylePreset = validStylePresets.includes(stylePreset as any) 
        ? stylePreset as 'casual' | 'smart_casual' | 'date' | 'outdoor' | 'business'
        : 'casual';

      const stylingRequest: StylingRequest = {
        imageUrl: finalImageUrl || '',
        weatherSummary: weatherSummary,
        location: location,
        stylePreset: validatedStylePreset,
        recommendedItems: recommendedItems.split(',').filter(item => item.trim()),
        preferredLanguage,
      };

      // 4. AI 스타일링 실행
      console.log('AI 스타일링 요청 시작:', {
        imageUrl: finalImageUrl,
        weatherSummary,
        location,
        stylePreset: validatedStylePreset,
        recommendedItems: recommendedItems.split(',').filter(item => item.trim()),
        preferredLanguage,
      });

      const stylingResult = await aiStylingService.generateStyleRecommendation(
        stylingRequest
      );

      console.log('AI 스타일링 결과:', {
        success: stylingResult ? true : false,
        hasImageUrl: stylingResult?.imageUrl ? true : false,
        hasDescription: stylingResult?.description ? true : false,
        hasItems: stylingResult?.items ? stylingResult.items.length : 0,
        hasTips: stylingResult?.tips ? stylingResult.tips.length : 0,
        resultKeys: stylingResult ? Object.keys(stylingResult) : [],
      });

      // 5. 응답 반환
      return NextResponse.json({
        success: true,
        data: stylingResult,
        metadata: {
          originalImageUrl: finalImageUrl,
          weatherSummary: weatherSummary,
          location: location,
          recommendedItems: recommendedItems.split(',').filter(item => item.trim()),
          stylePreset,
          preferredLanguage,
          timestamp: new Date().toISOString(),
        },
      });

    } catch (aiError) {
      console.error('AI 처리 오류:', aiError);
      
      return NextResponse.json(
        { 
          success: false,
          error: 'AI styling analysis failed',
          details: aiError instanceof Error ? aiError.message : 'AI service error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Photo analysis API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process photo analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 빠른 분석 API (AI 생성 없이 기본 분석만)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // 기본 분석 결과 반환 (AI 없이)
    const basicAnalysis = {
      bodyType: 'average',
      skinTone: 'medium',
      estimatedHeight: 170,
      currentStyle: '캐주얼',
      detectedColors: ['검은색', '흰색'],
      confidenceScore: 0.7,
    };

    return NextResponse.json({
      success: true,
      data: basicAnalysis,
      metadata: {
        analysisType: 'basic',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Quick analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform quick analysis' },
      { status: 500 }
    );
  }
}
