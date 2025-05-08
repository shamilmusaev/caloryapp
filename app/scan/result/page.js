'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanResult() {
  const router = useRouter();
  const [result, setResult] = useState({
    description: '',
    health_suggestion: '',
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0
  });

  useEffect(() => {
    try {
      const scanResult = localStorage.getItem('currentScanResult');
      if (scanResult) {
        const parsed = JSON.parse(scanResult);
        // Handle both direct response and nested output structure
        setResult(parsed.output || parsed);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error parsing scan result:', error);
      router.push('/dashboard');
    }
  }, [router]);

  const saveAndContinue = () => {
    // Save to meal history
    const history = JSON.parse(localStorage.getItem('mealHistory') || '[]');
    history.push({
      description: result.description,
      health_suggestion: result.health_suggestion,
      calories: result.calories,
      carbs: result.carbs,
      protein: result.protein,
      fats: result.fats,
      date: new Date().toISOString()
    });
    localStorage.setItem('mealHistory', JSON.stringify(history));
    router.push('/dashboard');
  };

  if (!result) return null;

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      fontFamily: "'Manrope', sans-serif"
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '32px',
        color: '#1A1A1A',
        textAlign: 'center'
      }}>
        Scan Results
      </h1>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#1A1A1A',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🍽️</span> Description
        </h2>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4A4A4A'
        }}>{result.description}</p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#1A1A1A',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💡</span> Health Suggestion
        </h2>
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4A4A4A'
        }}>{result.health_suggestion}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            fontSize: '16px', 
            marginBottom: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>🔥</span> Calories
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '800',
            color: '#1A1A1A'
          }}>{result.calories}</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            fontSize: '16px', 
            marginBottom: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>🥩</span> Protein
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '800',
            color: '#1A1A1A'
          }}>{result.protein}g</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            fontSize: '16px', 
            marginBottom: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>🌾</span> Carbs
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '800',
            color: '#1A1A1A'
          }}>{result.carbs}g</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            fontSize: '16px', 
            marginBottom: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span>💧</span> Fats
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '800',
            color: '#1A1A1A'
          }}>{result.fats}g</div>
        </div>
      </div>

      <button
        onClick={saveAndContinue}
        style={{
          backgroundColor: '#000000',
          color: 'white',
          border: 'none',
          borderRadius: '1.5rem',
          padding: '20px 32px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        Save and Continue
      </button>
    </div>
  );
}
