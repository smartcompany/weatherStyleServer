export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          padding: '40px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px'
          }}>
            WeatherStyle
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '40px'
          }}>
            날씨 기반 스타일 추천 API 서버
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: '#e3f2fd',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌤️</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>Weather</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                실시간 날씨 정보 제공
              </p>
            </div>
            
            <div style={{
              background: '#f3e5f5',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👗</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>Style</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                개인화된 스타일 추천
              </p>
            </div>
            
            <div style={{
              background: '#e8f5e8',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ color: '#333', marginBottom: '10px' }}>Advisor</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                액티비티 추천 서비스
              </p>
            </div>
          </div>

          <div style={{
            background: '#f5f5f5',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>API 엔드포인트</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{
                  background: '#2196f3',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}>GET</span>
                <code>/api/weather?lat=37.5665&lon=126.9780</code>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{
                  background: '#4caf50',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}>POST</span>
                <code>/api/style-recommendation</code>
              </div>
              <div>
                <span style={{
                  background: '#4caf50',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}>POST</span>
                <code>/api/activity-recommendation</code>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', color: '#888', fontSize: '0.9rem' }}>
            <p>Flutter 클라이언트와 연동되는 백엔드 API 서버입니다.</p>
            <p style={{ marginTop: '5px' }}>WeatherAPI.com을 사용하여 실시간 날씨 정보를 제공합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
