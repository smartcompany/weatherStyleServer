import { NextRequest, NextResponse } from 'next/server';
import { StyleService } from '@/lib/style-service';
import { RecommendationRequest } from '@/types/style';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { weather, preferences } = body;

    if (!weather || !preferences) {
      return NextResponse.json(
        { error: 'Weather and preferences are required' },
        { status: 400 }
      );
    }

    const styleService = new StyleService();
    const recommendations = await styleService.getActivityRecommendations(
      weather,
      preferences
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Activity recommendation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate activity recommendations' },
      { status: 500 }
    );
  }
}
