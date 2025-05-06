'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      backgroundColor: "white",
      color: "black",
      fontFamily: "'Manrope', sans-serif",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
        gap: "24px",
      }}>
        <div style={{
          borderRadius: "1rem",
          overflow: "hidden",
          width: "100%",
          maxWidth: "350px",
          height: "350px",
          position: "relative",
        }}>
          <Image
            src="https://images.unsplash.com/photo-1592415486689-125cbbfcbee2?q=80&w=800&auto=1"
            alt="Sandwich image"
            fill
            style={{
              objectFit: "cover",
            }}
            priority
          />
        </div>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "700",
          margin: "0",
          marginTop: "16px",
        }}>
          Calorie tracking made easy
        </h1>

        <p style={{
          fontSize: "18px",
          margin: "0",
          color: "#555",
        }}>
          Scan your food. Get your custom plan.
        </p>

        <button 
          onClick={() => router.push('/onboarding')}
          style={{
            backgroundColor: "#FFCC00",
            color: "black",
            border: "none",
            borderRadius: "1rem",
            padding: "16px 32px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            marginTop: "16px",
            fontFamily: "'Manrope', sans-serif",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
