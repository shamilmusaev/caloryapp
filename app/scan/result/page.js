'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanResult() {
  const router = useRouter();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const scanResult = localStorage.getItem('currentScanResult');
    if (scanResult) {
      setResult(JSON.parse(scanResult));
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  const saveAndContinue = () => {
    // Save to meal history
    const history = JSON.parse(localStorage.getItem('mealHistory') || '[]');
    history.push({
      ...result.output,
      date: new Date().toISOString()
    });
    localStorage.setItem('mealHistory', JSON.stringify(history));
    router.push('/dashboard');
  };

  if (!result) return null;

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      minHeight: '100vh',
      fontFamily: "'Manrope', sans-serif"
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '24px',
        color: 'black'
      }}>
        Scan Results
      </h1>

      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '1rem',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>Description</h2>
        <p>{result.output.description}</p>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '1rem',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px'
        }}>Health Suggestion</h2>
        <p>{result.output.health_suggestion}</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '1rem',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Calories</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{result.output.calories}</div>
        </div>
        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '1rem',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Protein</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{result.output.protein}g</div>
        </div>
        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '1rem',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Carbs</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{result.output.carbs}g</div>
        </div>
        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '1rem',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Fats</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{result.output.fats}g</div>
        </div>
      </div>

      <button
        onClick={saveAndContinue}
        style={{
          backgroundColor: '#FFCC00',
          color: 'black',
          border: 'none',
          borderRadius: '1rem',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif"
        }}
      >
        Save and Continue
      </button>
    </div>
  );
}
