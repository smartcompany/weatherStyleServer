import axios from 'axios';
import { Weather, WeatherForecast, OpenWeatherResponse, OpenWeatherForecastResponse } from '@/types/weather';

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.weatherapi.com/v1';

  constructor() {
    this.apiKey = process.env.WEATHERAPI_KEY || '';
    if (!this.apiKey) {
      // 테스트용 더미 데이터 사용
      console.log('WeatherAPI key not found, using dummy data');
    }
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<Weather> {
    // API 키가 없으면 더미 데이터 반환
    if (!this.apiKey) {
      return this.getDummyWeather();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/current.json`,
        {
          params: {
            key: this.apiKey,
            q: `${latitude},${longitude}`,
            aqi: 'yes', // 대기질 정보 포함
            lang: 'ko',
          },
        }
      );

      return this.transformWeatherApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return this.getDummyWeather();
    }
  }

  async getWeatherByCity(cityName: string): Promise<Weather> {
    // API 키가 없으면 더미 데이터 반환
    if (!this.apiKey) {
      return this.getDummyWeather();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/current.json`,
        {
          params: {
            key: this.apiKey,
            q: cityName,
            aqi: 'yes',
            lang: 'ko',
          },
        }
      );

      return this.transformWeatherApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      return this.getDummyWeather();
    }
  }

  async getWeatherForecast(latitude: number, longitude: number): Promise<WeatherForecast> {
    // API 키가 없으면 더미 예보 반환
    if (!this.apiKey) {
      return this.getDummyForecast();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/forecast.json`,
        {
          params: {
            key: this.apiKey,
            q: `${latitude},${longitude}`,
            days: 7, // 7일 예보
            aqi: 'yes',
            lang: 'ko',
          },
        }
      );

      return this.transformWeatherApiForecastResponse(response.data);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.getDummyForecast();
    }
  }

  private transformWeatherApiResponse(data: any): Weather {
    return {
      temperature: data.current.temp_c,
      feelsLike: data.current.feelslike_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph / 3.6, // kph를 m/s로 변환
      description: data.current.condition.text,
      icon: data.current.condition.icon.replace('//', 'https://'),
      main: data.current.condition.text,
      location: data.location.name,
      timestamp: new Date().toISOString(),
    };
  }

  private getDummyWeather(): Weather {
    return {
      temperature: 22.0,
      feelsLike: 24.0,
      humidity: 65,
      windSpeed: 3.5,
      description: '맑음',
      icon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
      main: 'Clear',
      location: '서울',
      timestamp: new Date().toISOString(),
    };
  }

  private getDummyForecast(): WeatherForecast {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0], // Convert to string format
        minTemp: 15 + Math.random() * 5,
        maxTemp: 25 + Math.random() * 5,
        description: i % 2 === 0 ? '맑음' : '흐림',
        icon: i % 2 === 0 ? '01d' : '03d',
        main: i % 2 === 0 ? 'Clear' : 'Clouds',
      });
    }
    return { days };
  }

  private transformWeatherApiForecastResponse(data: any): WeatherForecast {
    const days = data.forecast.forecastday.map((day: any) => ({
      date: day.date, // Keep as string to match WeatherDay interface
      minTemp: day.day.mintemp_c,
      maxTemp: day.day.maxtemp_c,
      description: day.day.condition.text,
      icon: day.day.condition.icon.replace('//', 'https://'),
      main: day.day.condition.text,
    }));
    
    return { days };
  }

  private transformWeatherResponse(data: OpenWeatherResponse): Weather {
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      location: data.name,
      timestamp: new Date().toISOString(),
    };
  }

  private transformForecastResponse(data: OpenWeatherForecastResponse): WeatherForecast {
    // Group forecast by days and get daily min/max temperatures
    const dailyForecasts = new Map<string, {
      minTemp: number;
      maxTemp: number;
      description: string;
      icon: string;
      main: string;
    }>();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          main: item.weather[0].main,
        });
      } else {
        const existing = dailyForecasts.get(date)!;
        existing.minTemp = Math.min(existing.minTemp, item.main.temp_min);
        existing.maxTemp = Math.max(existing.maxTemp, item.main.temp_max);
      }
    });

    const days = Array.from(dailyForecasts.entries()).map(([date, forecast]) => ({
      date,
      minTemp: forecast.minTemp,
      maxTemp: forecast.maxTemp,
      description: forecast.description,
      icon: forecast.icon,
      main: forecast.main,
    }));

    return { days };
  }
}
