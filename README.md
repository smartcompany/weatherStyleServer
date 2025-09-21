# WeatherStyle API Server

WeatherStyle 앱을 위한 Next.js API 서버입니다. WeatherAPI.com을 사용하여 날씨 정보와 스타일 추천 서비스를 제공합니다.

## 🌟 주요 기능

- **실시간 날씨 정보**: WeatherAPI.com 연동
- **스타일 추천**: 날씨 기반 개인화된 스타일 추천
- **액티비티 추천**: 날씨에 맞는 활동 추천
- **캐싱 시스템**: 10분 캐싱으로 API 호출 최적화
- **한국어 지원**: 완전한 한국어 날씨 정보

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
WEATHERAPI_KEY=your_weatherapi_key_here
NEXT_PUBLIC_APP_NAME=WeatherStyle
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### WeatherAPI.com API 키 발급

1. [WeatherAPI.com](https://www.weatherapi.com/) 가입
2. 무료 API 키 발급 (월 1,000,000 호출 제한)
3. `.env.local`에 키 설정

## 📡 API 엔드포인트

### 날씨 정보
```
GET /api/weather?lat={latitude}&lon={longitude}
```

**응답 예시:**
```json
{
  "temperature": 22.0,
  "feelsLike": 24.0,
  "humidity": 65,
  "windSpeed": 3.5,
  "description": "맑음",
  "icon": "https://cdn.weatherapi.com/weather/64x64/day/113.png",
  "main": "맑음",
  "location": "Seoul",
  "timestamp": "2025-09-21T05:51:09.949Z"
}
```

### 스타일 추천
```
POST /api/style-recommendation
```

**요청 본문:**
```json
{
  "weather": { ... },
  "preferences": { ... }
}
```

### 액티비티 추천
```
POST /api/activity-recommendation
```

## 🏗️ 프로젝트 구조

```
server/
├── src/
│   ├── app/api/              # API 라우트
│   │   ├── weather/          # 날씨 API
│   │   ├── style-recommendation/
│   │   └── activity-recommendation/
│   ├── lib/                  # 서비스 로직
│   │   └── weather-service.ts
│   └── types/                # TypeScript 타입
│       └── weather.ts
├── package.json
└── README.md
```

## 🌐 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포 완료

### 환경 변수 (Vercel)
- `WEATHERAPI_KEY`: WeatherAPI.com API 키

## 🔧 개발

### 로컬 테스트

```bash
# 날씨 API 테스트
curl "http://localhost:3000/api/weather?lat=37.5665&lon=126.9780"

# 스타일 추천 테스트
curl -X POST "http://localhost:3000/api/style-recommendation" \
  -H "Content-Type: application/json" \
  -d '{"weather": {...}, "preferences": {...}}'
```

## 📊 성능

- **응답 시간**: 평균 200ms (WeatherAPI.com)
- **캐싱**: 10분 메모리 캐싱
- **API 제한**: 월 1,000,000 호출 (무료 플랜)

## 🤝 기여

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

MIT License

## 🔗 관련 링크

- [WeatherAPI.com](https://www.weatherapi.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Platform](https://vercel.com)