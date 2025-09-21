export interface Weather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  location: string;
  timestamp: string;
}

export interface WeatherForecast {
  days: WeatherDay[];
}

export interface WeatherDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
  main: string;
}

export interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  name: string;
  dt: number;
}

export interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
      main: string;
    }>;
  }>;
}
