import { 
  StyleRecommendation, 
  ActivityRecommendation, 
  StyleCategory, 
  WeatherType, 
  Gender,
  UserPreferences
} from '@/types/style';
import { Weather } from '@/types/weather';

export class StyleService {
  async getStyleRecommendations(
    weather: Weather,
    preferences: UserPreferences
  ): Promise<StyleRecommendation[]> {
    const recommendations: StyleRecommendation[] = [];

    // 온도 기반 기본 추천
    recommendations.push(...this.getTemperatureBasedRecommendations(weather, preferences));

    // 날씨 상태별 추가 추천
    recommendations.push(...this.getWeatherBasedRecommendations(weather, preferences));

    // 사용자 선호도 기반 필터링
    return this.filterByPreferences(recommendations, preferences);
  }

  async getActivityRecommendations(
    weather: Weather,
    preferences: UserPreferences
  ): Promise<ActivityRecommendation[]> {
    const recommendations: ActivityRecommendation[] = [];

    // 날씨별 활동 추천
    if (weather.temperature >= 20 && weather.main.toLowerCase() === 'clear') {
      recommendations.push({
        id: 'outdoor_1',
        title: '야외 활동',
        description: '맑은 날씨에 산책이나 피크닉을 즐겨보세요',
        weatherType: WeatherType.SUNNY,
        temperature: weather.temperature,
        category: 'outdoor',
        tags: ['산책', '피크닉', '야외'],
      });
    }

    if (weather.main.toLowerCase() === 'rain') {
      recommendations.push({
        id: 'indoor_1',
        title: '실내 활동',
        description: '비 오는 날에는 카페나 박물관을 추천해요',
        weatherType: WeatherType.RAINY,
        temperature: weather.temperature,
        category: 'indoor',
        tags: ['카페', '박물관', '실내'],
      });
    }

    if (weather.main.toLowerCase() === 'snow') {
      recommendations.push({
        id: 'winter_1',
        title: '겨울 활동',
        description: '눈 오는 날에는 스키나 눈사람 만들기를 추천해요',
        weatherType: WeatherType.SNOWY,
        temperature: weather.temperature,
        category: 'winter',
        tags: ['스키', '눈사람', '겨울'],
      });
    }

    return recommendations;
  }

  private getTemperatureBasedRecommendations(
    weather: Weather,
    preferences: UserPreferences
  ): StyleRecommendation[] {
    const recommendations: StyleRecommendation[] = [];

    if (weather.temperature >= 30) {
      recommendations.push({
        id: 'hot_1',
        title: '시원한 여름 룩',
        description: '가벼운 소재의 민소매나 반팔을 추천해요',
        clothingItems: ['민소매', '반팔', '반바지', '치마', '샌들'],
        colors: ['흰색', '파란색', '연한 색상'],
        category: StyleCategory.CASUAL,
        weatherType: WeatherType.SUNNY,
        temperature: weather.temperature,
        imageUrl: '',
        confidence: 85,
      });
    } else if (weather.temperature >= 20) {
      recommendations.push({
        id: 'warm_1',
        title: '편안한 봄/가을 룩',
        description: '가벼운 긴팔이나 얇은 외투를 추천해요',
        clothingItems: ['긴팔', '반바지', '가벼운 외투', '스니커즈'],
        colors: ['베이지', '회색', '파스텔 톤'],
        category: StyleCategory.CASUAL,
        weatherType: WeatherType.SUNNY,
        temperature: weather.temperature,
        imageUrl: '',
        confidence: 80,
      });
    } else if (weather.temperature >= 10) {
      recommendations.push({
        id: 'cool_1',
        title: '따뜻한 가을 룩',
        description: '점퍼나 가디건을 추가해보세요',
        clothingItems: ['긴팔', '긴바지', '점퍼', '가디건', '부츠'],
        colors: ['갈색', '오렌지', '따뜻한 톤'],
        category: StyleCategory.CASUAL,
        weatherType: WeatherType.CLOUDY,
        temperature: weather.temperature,
        imageUrl: '',
        confidence: 85,
      });
    } else if (weather.temperature >= 0) {
      recommendations.push({
        id: 'cold_1',
        title: '따뜻한 겨울 룩',
        description: '패딩이나 코트를 추천해요',
        clothingItems: ['패딩', '코트', '긴바지', '목도리', '장갑'],
        colors: ['검은색', '네이비', '어두운 톤'],
        category: StyleCategory.CASUAL,
        weatherType: WeatherType.CLOUDY,
        temperature: weather.temperature,
        imageUrl: '',
        confidence: 90,
      });
    } else {
      recommendations.push({
        id: 'very_cold_1',
        title: '매우 따뜻한 겨울 룩',
        description: '두꺼운 패딩과 겨울 액세서리가 필요해요',
        clothingItems: ['두꺼운 패딩', '털부츠', '목도리', '장갑', '모자'],
        colors: ['검은색', '다크 그레이', '따뜻한 톤'],
        category: StyleCategory.CASUAL,
        weatherType: WeatherType.SNOWY,
        temperature: weather.temperature,
        imageUrl: '',
        confidence: 95,
      });
    }

    return recommendations;
  }

  private getWeatherBasedRecommendations(
    weather: Weather,
    preferences: UserPreferences
  ): StyleRecommendation[] {
    const recommendations: StyleRecommendation[] = [];

    switch (weather.main.toLowerCase()) {
      case 'rain':
        recommendations.push({
          id: 'rainy_1',
          title: '비 오는 날 룩',
          description: '우비나 방수 재킷을 준비하세요',
          clothingItems: ['우비', '방수 재킷', '긴바지', '부츠', '우산'],
          colors: ['노란색', '투명', '밝은 색상'],
          category: StyleCategory.CASUAL,
          weatherType: WeatherType.RAINY,
          temperature: weather.temperature,
          imageUrl: '',
          confidence: 90,
        });
        break;

      case 'snow':
        recommendations.push({
          id: 'snowy_1',
          title: '눈 오는 날 룩',
          description: '미끄럼 방지 신발과 따뜻한 옷을 추천해요',
          clothingItems: ['패딩', '스노우부츠', '목도리', '장갑', '모자'],
          colors: ['흰색', '파란색', '따뜻한 톤'],
          category: StyleCategory.SPORTY,
          weatherType: WeatherType.SNOWY,
          temperature: weather.temperature,
          imageUrl: '',
          confidence: 95,
        });
        break;

      case 'clouds':
        recommendations.push({
          id: 'cloudy_1',
          title: '흐린 날 룩',
          description: '레이어링으로 대비를 주어보세요',
          clothingItems: ['긴팔', '가디건', '긴바지', '스니커즈'],
          colors: ['회색', '베이지', '중성 톤'],
          category: StyleCategory.CASUAL,
          weatherType: WeatherType.CLOUDY,
          temperature: weather.temperature,
          imageUrl: '',
          confidence: 75,
        });
        break;
    }

    return recommendations;
  }

  private filterByPreferences(
    recommendations: StyleRecommendation[],
    preferences: UserPreferences
  ): StyleRecommendation[] {
    return recommendations.filter((rec) => {
      // 선호 스타일과 일치하는지 확인
      if (preferences.preferredStyles.length > 0) {
        return preferences.preferredStyles.includes(rec.category);
      }
      return true;
    }).map((rec) => {
      // 선호 색상이 있으면 색상 우선순위 조정
      if (preferences.preferredColors.length > 0) {
        const preferredColors = preferences.preferredColors.filter(color =>
          rec.colors.some(recColor => 
            recColor.toLowerCase().includes(color.toLowerCase()) ||
            color.toLowerCase().includes(recColor.toLowerCase())
          )
        );
        
        if (preferredColors.length > 0) {
          rec.confidence += 10; // 선호 색상이 있으면 신뢰도 증가
        }
      }
      return rec;
    });
  }
}
