export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            WeatherStyle
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            날씨 기반 스타일 추천 API 서버
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl mb-3">🌤️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Weather</h3>
              <p className="text-gray-600 text-sm">
                실시간 날씨 정보 제공
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-3xl mb-3">👗</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Style</h3>
              <p className="text-gray-600 text-sm">
                개인화된 스타일 추천
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Advisor</h3>
              <p className="text-gray-600 text-sm">
                액티비티 추천 서비스
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">API 엔드포인트</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">GET</span>
                <code>/api/weather?lat=37.5665&lon=126.9780</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">POST</span>
                <code>/api/style-recommendation</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">POST</span>
                <code>/api/activity-recommendation</code>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Flutter 클라이언트와 연동되는 백엔드 API 서버입니다.</p>
            <p className="mt-1">OpenWeatherMap API를 사용하여 실시간 날씨 정보를 제공합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
