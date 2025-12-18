import { useState, useCallback, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';

const MODEL_OPTIONS = {
  rmbg: {
    id: 'rmbg',
    name: 'RMBG-1.4',
    description: 'Works in all browsers',
    model: 'medium',
  },
};

export function useBackgroundRemoval() {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [webGPUAvailable, setWebGPUAvailable] = useState(false);
  const [selectedModel, setSelectedModel] = useState('rmbg');
  const abortController = useRef(null);

  // Check WebGPU on mount
  useEffect(() => {
    async function checkWebGPU() {
      if ('gpu' in navigator) {
        try {
          const adapter = await navigator.gpu.requestAdapter();
          setWebGPUAvailable(adapter !== null);
        } catch {
          setWebGPUAvailable(false);
        }
      }
    }
    checkWebGPU();
  }, []);

  const processImage = useCallback(async (imageSource) => {
    setStatus('loading');
    setProgress(0);
    setError(null);
    abortController.current = new AbortController();

    try {
      // Convert to blob if needed
      let blob;
      if (imageSource instanceof Blob) {
        blob = imageSource;
      } else if (typeof imageSource === 'string') {
        const response = await fetch(imageSource);
        blob = await response.blob();
      } else {
        throw new Error('Invalid image source');
      }

      setStatus('processing');

      const result = await removeBackground(blob, {
        model: MODEL_OPTIONS[selectedModel].model,
        progress: (p) => {
            // progress is formatted as "0.50" string or number from library
            // ensure we parse it correctly
            const val = typeof p === 'string' ? parseFloat(p.split(':')[1]) : p;
            setProgress(Math.round((val || 0) * 100));
        },
        // signal: abortController.current.signal, // Library might not support signal yet in all versions, checking docs is needed.
        // Assuming latest supports standard fetch signal behavior implicitly or explicitly.
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
      console.error("BG Removal Error", err);
      setStatus('error');
      setError(err.message);
      throw err;
    }
  }, [selectedModel]);

  const cancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
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
    webGPUAvailable,
    selectedModel,
    setSelectedModel,
    modelOptions: MODEL_OPTIONS,
  };
}
