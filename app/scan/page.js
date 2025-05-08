'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from './components/CameraCapture';

export default function ScanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageCapture = async (imageBlob) => {
    setLoading(true);
    setError('');
    
    try {
      // Convert blob to base64 for processing
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      
      reader.onloadend = () => {
        const base64data = reader.result;
        
        // Store temporarily while processing
        localStorage.setItem('currentScan', JSON.stringify({
          image: base64data,
          timestamp: new Date().toISOString()
        }));
        
        // Simulate processing delay
        setTimeout(() => {
          // TODO: Replace with actual API call
          const mockResult = {
            description: 'Scanned Food Item',
            calories: 250,
            carbs: 30,
            protein: 15,
            fats: 10,
            health_suggestion: 'Moderate portion size'
          };
          
          localStorage.setItem('currentScanResult', JSON.stringify(mockResult));
          router.push('/scan/result');
        }, 1500);
      };
      
    } catch (err) {
      setError('Failed to process image - Please try again');
      console.error('Image processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>Food Scanner</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <CameraCapture 
        onCapture={handleImageCapture} 
      />
      
      {loading && <div className="loading-indicator">Analyzing...</div>}
    </div>
  );
}
