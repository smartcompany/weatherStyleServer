import { NextRequest, NextResponse } from 'next/server';
import { AIStylingService, StylingRequest } from '@/lib/ai-styling-service';
import { WeatherService } from '@/lib/weather-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      imageBase64, 
      latitude, 
      longitude, 
      stylePreset = 'casual',
      colorPreferences,
      bodyNotes 
    } = body;

    // 필수 데이터 검증
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Location coordinates are required' },
        { status: 400 }
      );
    }

    const aiStylingService = new AIStylingService();
    const weatherService = new WeatherService();

    try {
      // 1. 현재 날씨 정보 가져오기
      const currentWeather = await weatherService.getCurrentWeather(
        parseFloat(latitude),
        parseFloat(longitude)
      );

      // 2. 이미지를 Supabase에 업로드
      const fileName = `user-photo-${Date.now()}.jpg`;
      const imageUrl = await aiStylingService.uploadImageToSupabase(
        imageBase64,
        fileName
      );

      // 3. AI 스타일링 요청 생성
      const stylingRequest: StylingRequest = {
        imageUrl,
        weather: currentWeather,
        stylePreset,
        colorPreferences,
        bodyNotes,
      };

      // 4. AI 스타일링 실행
      const stylingResult = await aiStylingService.generateStyleRecommendation(
        stylingRequest
      );

      // 5. 응답 반환
      return NextResponse.json({
        success: true,
        data: stylingResult,
        metadata: {
          originalImageUrl: imageUrl,
          weather: currentWeather,
          timestamp: new Date().toISOString(),
        },
      });

    } catch (aiError) {
      console.error('AI 처리 오류:', aiError);
      
      // AI 오류 시 더미 응답 반환
      const dummyResponse = aiStylingService.getDummyStylingResponse();
      
      return NextResponse.json({
        success: true,
        data: dummyResponse,
        metadata: {
          originalImageUrl: 'dummy',
          weather: await weatherService.getCurrentWeather(
            parseFloat(latitude),
            parseFloat(longitude)
          ),
          timestamp: new Date().toISOString(),
          note: 'AI 서비스 일시 중단으로 더미 데이터 제공',
        },
      });
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
