'use client';

export default function WorkoutFrequencyScreen({
  onSave,
  onBack,
  workoutFreq,
  setWorkoutFreq
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
        How many workouts do you do per week?
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
        {['0–2', '3–5', '6+'].map((option) => (
          <button
            key={option}
            onClick={() => setWorkoutFreq(option)}
            style={{
              backgroundColor: workoutFreq === option ? '#FFCC00' : '#f5f5f5',
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
            {option === '0–2' && '0–2 – Workouts now and then'}
            {option === '3–5' && '3–5 – A few workouts per week'}
            {option === '6+' && '6+ – Dedicated athlete'}
          </button>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={!workoutFreq}
        style={{
          backgroundColor: '#FFCC00',
          color: 'black',
          border: 'none',
          borderRadius: '1rem',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: !workoutFreq ? 'not-allowed' : 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          opacity: !workoutFreq ? 0.7 : 1,
        }}
      >
        Continue
      </button>
    </div>
  );
}
