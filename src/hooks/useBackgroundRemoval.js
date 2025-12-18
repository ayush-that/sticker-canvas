import { useState, useCallback, useRef, useEffect } from 'react';

export default function useBackgroundRemoval() {
  const [status, setStatus] = useState('idle'); // idle | loading | processing | complete | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const removeBackgroundRef = useRef(null);

  // Dynamically import the library when needed
  const loadLibrary = useCallback(async () => {
    if (removeBackgroundRef.current) return removeBackgroundRef.current;

    try {
      const module = await import('@imgly/background-removal');
      removeBackgroundRef.current = module.removeBackground;
      return removeBackgroundRef.current;
    } catch (err) {
      console.error('Failed to load background removal library:', err);
      throw new Error('Failed to load background removal library');
    }
  }, []);

  const processImage = useCallback(async (imageSource) => {
    setStatus('loading');
    setProgress(0);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      // Load the library
      const removeBackground = await loadLibrary();

      // Convert to blob if needed
      let blob;
      if (imageSource instanceof Blob) {
        blob = imageSource;
      } else if (typeof imageSource === 'string') {
        // Handle data URLs
        if (imageSource.startsWith('data:')) {
          const response = await fetch(imageSource);
          blob = await response.blob();
        } else {
          const response = await fetch(imageSource);
          blob = await response.blob();
        }
      } else {
        throw new Error('Invalid image source');
      }

      setStatus('processing');

      const result = await removeBackground(blob, {
        model: 'medium',
        progress: (p) => {
          setProgress(Math.round(p * 100));
        },
        output: {
          format: 'image/png',
          quality: 0.9,
        },
      });

      setStatus('complete');
      setProgress(100);
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle');
        return null;
      }
      console.error('Background removal failed:', err);
      setStatus('error');
      setError(err.message || 'Background removal failed');
      throw err;
    }
  }, [loadLibrary]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, []);

  return {
    processImage,
    cancel,
    reset,
    status,
    progress,
    error,
  };
}
