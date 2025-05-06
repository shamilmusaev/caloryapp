'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ValuePropScreen({ onContinue, onBack }) {
  const chartData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'Cal AI',
        data: [100, 95, 90, 85, 83, 82],
        borderColor: '#FFCC00',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Traditional Diet',
        data: [100, 85, 80, 90, 95, 98],
        borderColor: '#555',
        backgroundColor: 'rgba(85, 85, 85, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  };

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
        marginBottom: '16px',
        color: 'black',
      }}>
        Cal AI creates long-term results
      </h1>

      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '1rem',
        padding: '24px',
        marginBottom: '24px',
        height: '300px',
      }}>
        <Line data={chartData} options={chartOptions} />
      </div>

      <p style={{
        fontSize: '16px',
        color: '#555',
        marginBottom: '32px',
        textAlign: 'center',
      }}>
        80% of Cal AI users maintain their weight loss even 6 months later
      </p>
      <button
        onClick={onContinue}
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
          fontFamily: "'Manrope', sans-serif",
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        Continue
      </button>
    </div>
  );
}
