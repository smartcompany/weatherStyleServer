// 환경 변수 타입 정의
export interface EnvironmentVariables {
  // OpenAI
  OPENAI_API_KEY: string;
  
  // WeatherAPI
  WEATHERAPI_KEY: string;
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STORAGE_BUCKET: string;
  
  // App Configuration
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
}

// 환경 변수 검증 함수
export function validateEnvironmentVariables(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = [
    'WEATHERAPI_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'STORAGE_BUCKET',
  ];

  const optionalVars = [
    'OPENAI_API_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missingVars: string[] = [];

  // 필수 환경 변수 검사
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // 선택적 환경 변수 경고
  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      console.warn(`⚠️ 선택적 환경 변수 누락: ${varName}`);
    }
  });

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// 환경 변수 로드 헬퍼
export function getEnvVar(key: keyof EnvironmentVariables, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${key}`);
  }
  return value || defaultValue || '';
}
