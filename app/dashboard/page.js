'use client';

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    // Update active tab based on date
    const today = new Date();
    setActiveTab(currentDate.toDateString() === today.toDateString() ? 'today' : 
                 currentDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString() ? 'yesterday' : '');
  }, [currentDate]);
  // Get user data from onboarding
  const [userData, setUserData] = useState(null);

  // Get calculated nutrition data from onboarding
  const [nutritionData, setNutritionData] = useState(null);
  const [caloriesRemaining, setCaloriesRemaining] = useState(0);
  const [macros, setMacros] = useState({
    protein: { remaining: 0, total: 0, status: 'left' },
    carbs: { remaining: 0, total: 0, status: 'left' },
    fats: { remaining: 0, total: 0, status: 'left' }
  });

  useEffect(() => {
    // Get user data from onboarding
    const storedData = localStorage.getItem('nutritionData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserData(data);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response JSON
      const data = await response.json();
      console.log('API Response:', data);
      
      // Create a safe result object with default values for all expected fields
      // This ensures we always have valid data even if the API response is incomplete
      const safeResult = {
        description: 'Unknown Food',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        health_suggestion: ''
      };
      
      // Safely extract data from the response if available
      if (data && Array.isArray(data) && data.length > 0 && data[0].output) {
        // Handle nested output structure
        const output = data[0].output;
        
        // Safely extract each field with type checking
        if (output.description && typeof output.description === 'string') {
          safeResult.description = output.description;
        }
        
        // Convert numeric fields with proper type checking
        safeResult.calories = typeof output.calories === 'number' ? output.calories : 
                             (parseInt(output.calories) || 0);
        safeResult.protein = typeof output.protein === 'number' ? output.protein : 
                            (parseInt(output.protein) || 0);
        safeResult.carbs = typeof output.carbs === 'number' ? output.carbs : 
                          (parseInt(output.carbs) || 0);
        safeResult.fats = typeof output.fats === 'number' ? output.fats : 
                         (parseInt(output.fats) || 0);
        
        if (output.health_suggestion && typeof output.health_suggestion === 'string') {
          safeResult.health_suggestion = output.health_suggestion;
        }
      }

      // Store the scan result
      localStorage.setItem('currentScanResult', JSON.stringify(safeResult));
      console.log('Processed Result:', safeResult);

      // Add to meal history
      const mealHistory = JSON.parse(localStorage.getItem('mealHistory') || '[]');
      const newMeal = {
        description: safeResult.description,
        calories: safeResult.calories,
        protein: safeResult.protein,
        carbs: safeResult.carbs,
        fats: safeResult.fats,
        date: new Date().toISOString(),
        image: imageSrc
      };
      mealHistory.unshift(newMeal);
      localStorage.setItem('mealHistory', JSON.stringify(mealHistory));

      // Update recent meals
      setRecentMeals(prev => [{
        name: safeResult.description,
        calories: safeResult.calories,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        macros: {
          protein: safeResult.protein,
          carbs: safeResult.carbs,
          fats: safeResult.fats
        },
        image: imageSrc
      }, ...prev.filter(meal => meal.name !== 'Analyzing...').slice(0, 4)]);

      router.push('/scan/result');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setRecentMeals(prev => prev.filter(meal => meal.name !== 'Analyzing...'));
      alert('Failed to analyze image. Please try again.');
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
      image: meal.image || '/food-placeholder.jpg'
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
        padding: '0 8px',
        width: '100%'
      }}>
        <div style={{ 
          fontWeight: '700', 
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#000000' }}>🍎</span> Cal AI
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
            }}
            style={{
              fontWeight: '600',
              color: activeTab === 'today' ? 'black' : '#888',
              borderBottom: activeTab === 'today' ? '2px solid #FFCC00' : 'none',
              padding: '4px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Today
          </button>
          <button 
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              setCurrentDate(yesterday);
            }}
            style={{
              fontWeight: '600',
              color: activeTab === 'yesterday' ? 'black' : '#888',
              borderBottom: activeTab === 'yesterday' ? '2px solid #FFCC00' : 'none',
              padding: '4px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Yesterday
          </button>
        </div>

        <div style={{ fontSize: '20px', color: '#000000' }}>🔔</div>
      </div>

      {/* Calorie Summary */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
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
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              lineHeight: '1'
            }}>{caloriesRemaining || 0}</div>
            <div style={{
              fontSize: '0.9rem',
              color: '#666',
              fontWeight: '500',
              marginTop: '0.25rem'
            }}>
              Calories left
            </div>
          </div>
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            position: 'relative'
          }}>
            {/* Серый фон круга */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '0.5rem solid #eee'
            }}></div>
            
            {/* Прогресс круга (черная часть) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '0.5rem solid transparent',
              borderTopColor: '#000',
              borderRightColor: '#000',
              transform: `rotate(${nutritionData ? Math.round(((nutritionData.calories - caloriesRemaining) / nutritionData.calories) * 360 / 4) : 0}deg)`,
              clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)'
            }}></div>
            
            {/* Внутренний белый круг с иконкой */}
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                color: '#000000'
              }}>🔥</div>
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
            icon: '🥩',
            color: '#000000',
            label: 'Protein over'
          },
          { 
            macro: 'carbs',
            icon: '🌾',
            color: '#000000',
            label: 'Carbs left'
          },
          { 
            macro: 'fats',
            icon: '💧',
            color: '#000000',
            label: 'Fats left'
          }
        ].map(({macro, icon, color, label}) => {
          const data = macros[macro];
          const percentage = data.total > 0 ? Math.round((data.remaining / data.total) * 100) : 0;
          
          return (
            <div key={macro} style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: '700',
                marginBottom: '0.25rem'
              }}>{data.remaining || 0}g</div>
              <div style={{
                fontSize: '0.75rem',
                color: '#555',
                marginBottom: '0.5rem'
              }}>{macro === 'protein' ? 'Protein over' : macro === 'carbs' ? 'Carbs left' : 'Fats left'}</div>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                margin: '0 auto',
                position: 'relative'
              }}>
                {/* Серый фон круга */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '0.2rem solid #eee'
                }}></div>
                
                {/* Прогресс круга (цветная часть) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '0.2rem solid transparent',
                  borderTopColor: color,
                  borderRightColor: color,
                  transform: `rotate(${percentage * 3.6 / 4}deg)`,
                  clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)'
                }}></div>
                
                {/* Внутренний белый круг с иконкой */}
                <div style={{
                  position: 'absolute',
                  top: '0.2rem',
                  left: '0.2rem',
                  width: '2.1rem',
                  height: '2.1rem',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '1rem',
                    color: color
                  }}>{icon}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recently Uploaded */}
      <div style={{ marginBottom: '5rem' }}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>Recently uploaded</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {recentMeals.map((meal, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '0.75rem',
                backgroundImage: `url(${meal.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>{meal.name}</div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#888'
                  }}>{meal.time}</div>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>{meal.calories} calories</div>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  fontSize: '0.75rem'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#000000' }}>🥩</span> {meal.macros.protein}g
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#000000' }}>🌾</span> {meal.macros.carbs}g
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#000000' }}>💧</span> {meal.macros.fats}g
                  </span>
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
        left: '50%',
        transform: 'translateX(-50%)',
        width: '390px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
        borderTop: '1px solid #f0f0f0'
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
          <span style={{ fontSize: '1.25rem', color: '#000000' }}>🏠</span>
          <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Home</span>
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
          <span style={{ fontSize: '1.25rem', color: '#000000' }}>📊</span>
          <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Analytics</span>
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
          <span style={{ fontSize: '1.25rem', color: '#000000' }}>⚙️</span>
          <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>Settings</span>
        </button>
      </div>

      {/* Floating Action Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          zIndex: 10
        }}
        onClick={() => setShowCamera(true)}
      >
        <span style={{ fontSize: '1.5rem', color: 'white' }}>+</span>
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
