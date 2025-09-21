export enum StyleCategory {
  CASUAL = 'casual',
  FORMAL = 'formal',
  SPORTY = 'sporty',
  TRENDY = 'trendy',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum WeatherType {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  WINDY = 'windy',
}

export interface StyleRecommendation {
  id: string;
  title: string;
  description: string;
  clothingItems: string[];
  colors: string[];
  category: StyleCategory;
  weatherType: WeatherType;
  temperature: number;
  imageUrl: string;
  confidence: number;
}

export interface ActivityRecommendation {
  id: string;
  title: string;
  description: string;
  weatherType: WeatherType;
  temperature: number;
  category: string;
  tags: string[];
}

export interface UserPreferences {
  gender: Gender;
  preferredStyles: StyleCategory[];
  preferredColors: string[];
  notificationsEnabled: boolean;
  preferredLanguage: string;
  adsEnabled: boolean;
}

export interface RecommendationRequest {
  weather: import('./weather').Weather;
  preferences: UserPreferences;
}

export interface RecommendationResponse {
  recommendations: StyleRecommendation[] | ActivityRecommendation[];
}
