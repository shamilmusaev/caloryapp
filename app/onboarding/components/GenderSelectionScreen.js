'use client';

export default function GenderSelectionScreen({
  onSave,
  onBack,
  gender,
  setGender
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
        Choose your Gender
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
        gap: '12px',
        marginBottom: '32px',
      }}>
        {['Male', 'Female', 'Other'].map((option) => (
          <button
            key={option}
            onClick={() => setGender(option)}
            style={{
              backgroundColor: gender === option ? '#FFCC00' : '#f5f5f5',
              color: 'black',
              border: 'none',
              borderRadius: '1rem',
              padding: '16px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              fontFamily: "'Manrope', sans-serif",
              transition: 'background-color 0.2s',
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={!gender}
        style={{
          backgroundColor: '#FFCC00',
          color: 'black',
          border: 'none',
          borderRadius: '1rem',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: !gender ? 'not-allowed' : 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          opacity: !gender ? 0.7 : 1,
        }}
      >
        Continue
      </button>
    </div>
  );
}
