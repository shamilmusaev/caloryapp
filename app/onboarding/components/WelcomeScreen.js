'use client';

import Image from 'next/image';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <>
      <Image
        src="https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?q=80&w=800&auto=1"
        alt="Healthy sandwich"
        width={300}
        height={200}
        style={{
          borderRadius: '1rem',
          objectFit: 'cover',
          marginBottom: '32px',
        }}
      />
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        margin: '0',
        marginBottom: '16px',
        textAlign: 'center',
        color: 'black',
      }}>
        Calorie tracking made easy
      </h1>
      <p style={{
        fontSize: '18px',
        margin: '0',
        color: '#555',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        Scan your food. Get your custom plan.
      </p>
      <button
        onClick={onGetStarted}
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
          maxWidth: '400px',
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        Get Started
      </button>
    </>
  );
}
