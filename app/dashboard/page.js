'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [currentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');
  const [caloriesRemaining, setCaloriesRemaining] = useState(1250);
  const [macros, setMacros] = useState({
    protein: { remaining: 45, total: 140, status: 'over' },
    carbs: { remaining: 89, total: 210, status: 'left' },
    fats: { remaining: 48, total: 65, status: 'left' }
  });
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
            padding: '4px 0'
          }}>
            Today
          </button>
          <button style={{
            fontWeight: '600',
            color: activeTab === 'yesterday' ? 'black' : '#888',
            borderBottom: activeTab === 'yesterday' ? '2px solid #FFCC00' : 'none',
            padding: '4px 0'
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
              {Math.round((caloriesRemaining / 2000) * 100)}%
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
      <div style={{
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
      }}>
        <span style={{ fontSize: '1.5rem' }}>📷</span>
      </div>
      </div>
    </div>
  );
}
