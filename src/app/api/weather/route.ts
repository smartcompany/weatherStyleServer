import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather-service';

// 캐시 저장소
const weatherCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

function getCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function getCachedWeather(key: string) {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedWeather(key: string, data: any) {
  weatherCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const cacheKey = getCacheKey(latitude, longitude);

    // 캐시된 데이터 확인
    const cachedWeather = getCachedWeather(cacheKey);
    if (cachedWeather) {
      console.log('Returning cached weather data for:', cacheKey);
      return NextResponse.json(cachedWeather);
    }

    // 새로운 데이터 가져오기
    const weatherService = new WeatherService();
    
    // 현재 날씨와 예보를 함께 가져오기
    const [weather, forecast] = await Promise.all([
      weatherService.getCurrentWeather(latitude, longitude),
      weatherService.getWeatherForecast(latitude, longitude)
    ]);

    const result = {
      current: weather,
      forecast: forecast
    };

    // 캐시에 저장
    setCachedWeather(cacheKey, result);
    console.log('Cached new weather data for:', cacheKey);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city } = body;

    if (!city) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }

    const weatherService = new WeatherService();
    const weather = await weatherService.getWeatherByCity(city);

    return NextResponse.json(weather);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
