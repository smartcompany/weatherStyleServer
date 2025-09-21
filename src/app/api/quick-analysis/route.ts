import { NextRequest, NextResponse } from 'next/server';
import { AIStylingService } from '@/lib/ai-styling-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, analysisType = 'basic' } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const aiStylingService = new AIStylingService();

    // 빠른 분석 (AI 없이 기본 추정)
    const basicAnalysis = {
      id: `analysis_${Date.now()}`,
      bodyType: 'average',
      skinTone: 'medium',
      estimatedHeight: 170,
      currentStyle: '캐주얼',
      detectedColors: ['검은색', '흰색', '회색'],
      confidenceScore: 0.75,
      analysisType,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: basicAnalysis,
      metadata: {
        processingTime: '0.1s',
        aiModel: 'basic_analysis_v1',
        version: '1.0.0',
      },
    });

  } catch (error) {
    console.error('Quick analysis API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to perform quick analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
