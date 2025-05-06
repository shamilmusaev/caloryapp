'use client';

export default function HeightWeightScreen({ 
  onSave, 
  onBack, 
  height, 
  weight, 
  setHeight, 
  setWeight 
}) {
  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'white',
      height: '100vh',
      fontFamily: "'Manrope', sans-serif",
    }}>
      <button 
        onClick={onBack}
        style={{
          backgroundColor: 'transparent',
          color: '#555',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        ← Back
      </button>

      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        margin: '0',
        marginBottom: '8px',
        color: 'black',
      }}>
        Height & Weight
      </h1>
      <p style={{
        fontSize: '16px',
        margin: '0',
        color: '#555',
        marginBottom: '32px',
      }}>
        This will be used to calibrate your custom plan.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            color: '#555',
          }}>
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '1rem',
              fontFamily: "'Manrope', sans-serif",
            }}
            placeholder="Enter your height"
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            color: '#555',
          }}>
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '1rem',
              fontFamily: "'Manrope', sans-serif",
            }}
            placeholder="Enter your weight"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={!height || !weight}
        style={{
          backgroundColor: '#FFCC00',
          color: 'black',
          border: 'none',
          borderRadius: '1rem',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: (!height || !weight) ? 'not-allowed' : 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          opacity: (!height || !weight) ? 0.7 : 1,
        }}
      >
        Continue
      </button>
    </div>
  );
}
