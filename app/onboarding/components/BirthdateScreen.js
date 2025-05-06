'use client';

export default function BirthdateScreen({
  onSave,
  onBack,
  birthdate,
  setBirthdate
}) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 100}, (_, i) => currentYear - i);

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
        When were you born?
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
            Month
          </label>
          <select
            value={birthdate?.month || ''}
            onChange={(e) => setBirthdate({...birthdate, month: e.target.value})}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '1rem',
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            <option value="">Select month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            color: '#555',
          }}>
            Day
          </label>
          <select
            value={birthdate?.day || ''}
            onChange={(e) => setBirthdate({...birthdate, day: e.target.value})}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '1rem',
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            <option value="">Select day</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '16px',
            color: '#555',
          }}>
            Year
          </label>
          <select
            value={birthdate?.year || ''}
            onChange={(e) => setBirthdate({...birthdate, year: e.target.value})}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '1rem',
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={!birthdate?.month || !birthdate?.day || !birthdate?.year}
        style={{
          backgroundColor: '#FFCC00',
          color: 'black',
          border: 'none',
          borderRadius: '1rem',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: (!birthdate?.month || !birthdate?.day || !birthdate?.year) ? 'not-allowed' : 'pointer',
          width: '100%',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          opacity: (!birthdate?.month || !birthdate?.day || !birthdate?.year) ? 0.7 : 1,
        }}
      >
        Continue
      </button>
    </div>
  );
}
