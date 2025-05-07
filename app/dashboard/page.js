'use client';

import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [currentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');
  // Sample user data - in a real app this would come from user profile/API
  const [userData] = useState({
    recommendedCalories: 2000,
    recommendedProtein: 140,
    recommendedCarbs: 210,
    recommendedFats: 65
  });

  const [caloriesRemaining, setCaloriesRemaining] = useState(1250);
  const [macros, setMacros] = useState({
    protein: { 
      remaining: 45, 
      total: userData.recommendedProtein,
      status: 'over' 
    },
    carbs: { 
      remaining: 89, 
      total: userData.recommendedCarbs,
      status: 'left' 
    },
    fats: { 
      remaining: 48, 
      total: userData.recommendedFats,
      status: 'left' 
    }
  });
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // In a real app, this would send to your API for calorie analysis
    console.log('Captured image:', imageSrc);
    setShowCamera(false);
    // Add temporary meal while waiting for API response
    setRecentMeals(prev => [{
      name: 'Analyzing...',
      calories: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      macros: { protein: 0, carbs: 0, fats: 0 },
      image: imageSrc
    }, ...prev.slice(0, 4)]);
  };

  const [recentMeals, setRecentMeals] = useState([
    { 
      name: 'Fattoush Salad', 
      calories: 153, 
      time: '12:57 PM',
      macros: { protein: 12, carbs: 10, fats: 5 },
      image: '/salad.jpg'
    },
    { 
      name: 'Protein Shake', 
      calories: 180, 
      time: '10:45 AM',
      macros: { protein: 24, carbs: 8, fats: 2 },
      image: '/shake.jpg'
    }
  ]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      fontFamily: "'Manrope', sans-serif",
      color: 'black'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '390px',
        minHeight: '100vh',
        padding: '16px',
        position: 'relative',
        overflowX: 'hidden'
      }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '0 8px'
      }}>
        <div style={{ 
          fontWeight: '700', 
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🍎</span> Cal AI
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{
            fontWeight: '600',
            color: activeTab === 'today' ? 'black' : '#888',
            borderBottom: activeTab === 'today' ? '2px solid #FFCC00' : 'none',
            padding: '4px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>
            Today
          </button>
          <button style={{
            fontWeight: '600',
            color: activeTab === 'yesterday' ? 'black' : '#888',
            borderBottom: activeTab === 'yesterday' ? '2px solid #FFCC00' : 'none',
            padding: '4px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>
            Yesterday
          </button>
        </div>

        <div style={{ fontSize: '20px' }}>🔔</div>
      </div>

      {/* Calorie Summary */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                lineHeight: '1'
              }}>{caloriesRemaining}</div>
              <div style={{
                fontSize: '1rem',
                color: 'black',
                fontWeight: '500',
                marginTop: '0.5rem'
              }}>
                Calories left
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#888',
                marginTop: '0.25rem'
              }}>
                of {2000} recommended
              </div>
            </div>
          </div>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            border: '0.5rem solid #FFCC00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              fontSize: '1.5rem'
            }}>🔥</div>
            <div style={{
              position: 'absolute',
              fontSize: '0.9rem',
              fontWeight: '700'
            }}>
              {Math.round(((userData.recommendedCalories - caloriesRemaining) / userData.recommendedCalories) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Macro Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {[
          { 
            macro: 'protein',
            icon: '🍗',
            color: '#FF3B30',
            label: 'Protein over'
          },
          { 
            macro: 'carbs',
            icon: '🌾',
            color: '#FF9500',
            label: 'Carbs left'
          },
          { 
            macro: 'fats',
            icon: '💧',
            color: '#007AFF',
            label: 'Fats left'
          }
        ].map(({macro, icon, color, label}) => {
          const data = macros[macro];
          return (
            <div key={macro} style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem'
              }}>{icon}</div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.25rem'
              }}>{data.remaining}g</div>
              <div style={{
                fontSize: '0.75rem',
                color: '#555',
                marginBottom: '0.75rem'
              }}>{label}</div>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                border: `0.25rem solid ${color}`,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: color
              }}>
                {Math.round((data.remaining / data.total) * 100)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Uploaded */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>Recently Uploaded</h2>

        <div style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {recentMeals.map((meal, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              minWidth: '12rem',
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                backgroundImage: `url(${meal.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>{meal.name}</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  marginBottom: '0.5rem'
                }}>{meal.time}</div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>{meal.calories} calories</div>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  fontSize: '0.75rem'
                }}>
                  <span style={{ color: '#FF3B30' }}>🥩 {meal.macros.protein}g</span>
                  <span style={{ color: '#FF9500' }}>🌾 {meal.macros.carbs}g</span>
                  <span style={{ color: '#007AFF' }}>💧 {meal.macros.fats}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
      }}>
        <button style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: 'black',
          background: 'none',
          border: 'none'
        }}>
          <span style={{ fontSize: '1.25rem' }}>🏠</span>
        </button>
        <button style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: '#888',
          background: 'none',
          border: 'none'
        }}>
          <span style={{ fontSize: '1.25rem' }}>📊</span>
        </button>
        <button style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          color: '#888',
          background: 'none',
          border: 'none'
        }}>
          <span style={{ fontSize: '1.25rem' }}>⚙️</span>
        </button>
      </div>

      {/* Floating Action Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '5rem',
          right: '1.5rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: '#FFCC00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        onClick={() => setShowCamera(true)}
      >
        <span style={{ fontSize: '1.5rem' }}>📷</span>
      </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: '100%',
              maxWidth: '500px',
              borderRadius: '1rem',
              marginBottom: '1rem'
            }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowCamera(false)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: '#FF3B30',
                color: 'white',
                border: 'none',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              onClick={capture}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: '#FFCC00',
                color: 'black',
                border: 'none',
                fontWeight: '600'
              }}
            >
              Capture
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
