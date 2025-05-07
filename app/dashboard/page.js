'use client';

import { useState, useRef, useEffect } from 'react';
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

  // Get calculated nutrition data from onboarding
  const [nutritionData, setNutritionData] = useState(null);
  const [caloriesRemaining, setCaloriesRemaining] = useState(0);
  const [macros, setMacros] = useState({
    protein: { remaining: 0, total: 0, status: 'left' },
    carbs: { remaining: 0, total: 0, status: 'left' },
    fats: { remaining: 0, total: 0, status: 'left' }
  });

  useEffect(() => {
    // In a real app, this would come from your state management or API
    const storedData = localStorage.getItem('nutritionData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setNutritionData(data);
      setCaloriesRemaining(data.calories);
      setMacros({
        protein: { 
          remaining: data.protein, 
          total: data.protein,
          status: 'left' 
        },
        carbs: { 
          remaining: data.carbs, 
          total: data.carbs,
          status: 'left' 
        },
        fats: { 
          remaining: data.fat, 
          total: data.fat,
          status: 'left' 
        }
      });
    }
  }, []);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setShowCamera(false);
    
    try {
      // Add temporary meal while waiting for API response
      setRecentMeals(prev => [{
        name: 'Analyzing...',
        calories: 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        macros: { protein: 0, carbs: 0, fats: 0 },
        image: imageSrc
      }, ...prev.slice(0, 4)]);

      // Convert base64 image to blob
      const blob = await fetch(imageSrc).then(res => res.blob());
      
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      const response = await fetch('http://localhost:5678/webhook-test/7d422945-75f0-4f01-99a3-26a91e490009', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      localStorage.setItem('currentScanResult', JSON.stringify(result));
      router.push('/scan/result');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setRecentMeals(prev => prev.filter(meal => meal.name !== 'Analyzing...'));
    }
  };

  const navigateToDate = (daysOffset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysOffset);
    setCurrentDate(newDate);
  };

  const [recentMeals, setRecentMeals] = useState([]);

  useEffect(() => {
    // Load meal history for current date
    const mealHistory = JSON.parse(localStorage.getItem('mealHistory') || '[]');
    const todayMeals = mealHistory.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.toDateString() === currentDate.toDateString();
    });
    
    setRecentMeals(todayMeals.map(meal => ({
      name: meal.description || 'Scanned Food',
      calories: meal.calories,
      time: new Date(meal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      macros: { 
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats
      },
      image: '/food-placeholder.jpg'
    })));

    // Update nutrition stats
    if (nutritionData) {
      const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = todayMeals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = todayMeals.reduce((sum, meal) => sum + meal.carbs, 0);
      const totalFats = todayMeals.reduce((sum, meal) => sum + meal.fats, 0);

      setCaloriesRemaining(Math.max(0, nutritionData.calories - totalCalories));
      setMacros({
        protein: {
          remaining: Math.max(0, nutritionData.protein - totalProtein),
          total: nutritionData.protein,
          status: totalProtein > nutritionData.protein ? 'over' : 'left'
        },
        carbs: {
          remaining: Math.max(0, nutritionData.carbs - totalCarbs),
          total: nutritionData.carbs,
          status: totalCarbs > nutritionData.carbs ? 'over' : 'left'
        },
        fats: {
          remaining: Math.max(0, nutritionData.fat - totalFats),
          total: nutritionData.fat,
          status: totalFats > nutritionData.fat ? 'over' : 'left'
        }
      });
    }
  }, [currentDate, nutritionData]);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigateToDate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ◀
        </button>
        <div style={{ 
          fontWeight: '700', 
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🍎</span> Cal AI
        </div>
        <button 
          onClick={() => navigateToDate(1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ▶
        </button>
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
                of {nutritionData?.calories || 2000} recommended
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
              fontSize: '1rem'
            }}>🔥</div>
            <div style={{
              position: 'absolute',
              fontSize: '0.9rem',
              fontWeight: '700'
            }}>
              {nutritionData ? Math.round(((nutritionData.calories - caloriesRemaining) / nutritionData.calories) * 100) : 0}%
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
