'use client';
import { useState, useRef, useEffect } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [cameraFacingMode, setCameraFacingMode] = useState('environment'); // Default to rear camera

  useEffect(() => {
    let stream;
    
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraFacingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Camera access denied - Please enable camera permissions');
        console.error('Camera error:', err);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraFacingMode]);

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(async blob => {
      try {
        // Process blob here or pass to parent
        onCapture(blob);
      } catch (err) {
        setError('Failed to process image - Please try again');
        console.error('Processing error:', err);
      }
    }, 'image/jpeg', 0.9);
  };

  const toggleCamera = () => {
    setCameraFacingMode(prev => 
      prev === 'environment' ? 'user' : 'environment'
    );
  };

  return (
    <div className="camera-container">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline muted />
          <div className="camera-controls">
            <button onClick={capturePhoto}>Capture</button>
            <button onClick={toggleCamera}>
              Switch Camera ({cameraFacingMode === 'environment' ? 'Front' : 'Rear'})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
