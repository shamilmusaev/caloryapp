'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WeightInput() {
  const router = useRouter();
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [unit, setUnit] = useState('kg'); // 'kg' or 'lb'

  const handleContinue = () => {
    if (currentWeight && targetWeight) {
      // Store the weight information in localStorage
      localStorage.setItem('currentWeight', currentWeight);
      localStorage.setItem('targetWeight', targetWeight);
      localStorage.setItem('weightUnit', unit);
      
      // Navigate to dashboard or next onboarding step
      router.push('/dashboard');
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'kg' ? 'lb' : 'kg');
  };

  return (
    <>
      <h1 style={{
        fontSize: "28px",
        fontWeight: "700",
        margin: "0",
        marginTop: "16px",
      }}>
        Your weight details
      </h1>

      <p style={{
        fontSize: "18px",
        margin: "0",
        color: "#555",
        marginBottom: "16px",
      }}>
        This helps us calculate your daily calorie needs
      </p>

      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "20px",
        marginTop: "16px",
      }}>
        <div style={{ width: "100%" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}>
            <label style={{ fontWeight: "600", fontSize: "16px" }}>
              Current weight
            </label>
            <button 
              onClick={toggleUnit}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#555",
                fontSize: "16px",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {unit.toUpperCase()}
            </button>
          </div>
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder={`Your current weight in ${unit}`}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              borderRadius: "1rem",
              border: "1px solid #ddd",
              outline: "none",
              fontFamily: "'Manrope', sans-serif",
            }}
          />
        </div>

        <div style={{ width: "100%" }}>
          <label style={{ 
            fontWeight: "600", 
            fontSize: "16px",
            display: "block",
            marginBottom: "8px",
          }}>
            Target weight
          </label>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder={`Your target weight in ${unit}`}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              borderRadius: "1rem",
              border: "1px solid #ddd",
              outline: "none",
              fontFamily: "'Manrope', sans-serif",
            }}
          />
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "12px", 
        width: "100%",
        marginTop: "24px",
      }}>
        <button 
          onClick={() => router.back()}
          style={{
            backgroundColor: "#f5f5f5",
            color: "black",
            border: "none",
            borderRadius: "1rem",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            width: "40%",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Back
        </button>

        <button 
          onClick={handleContinue}
          disabled={!currentWeight || !targetWeight}
          style={{
            backgroundColor: currentWeight && targetWeight ? "#FFCC00" : "#f5f5f5",
            color: "black",
            border: "none",
            borderRadius: "1rem",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: currentWeight && targetWeight ? "pointer" : "not-allowed",
            width: "60%",
            fontFamily: "'Manrope', sans-serif",
            boxShadow: currentWeight && targetWeight ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
            opacity: currentWeight && targetWeight ? 1 : 0.7,
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
}