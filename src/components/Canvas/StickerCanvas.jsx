import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import useCanvasStore from '../../store/canvasStore';
import { useExport } from '../../hooks/useExport';

export default function StickerCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const laptop = useCanvasStore((state) => state.laptop);
  const showGrid = useCanvasStore((state) => state.showGrid);
  const stickers = useCanvasStore((state) => state.stickers);

  const { handleExport } = useExport(fabricCanvasRef);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Create fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true, // Selected object stays in place in stack
    });

    fabricCanvasRef.current = canvas;

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && fabricCanvasRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        fabricCanvasRef.current.setDimensions({ width, height });
        // Optional: Re-center content
        updateLaptopImage();
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial laptop load
    updateLaptopImage();

    return () => {
      resizeObserver.disconnect();
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Update laptop image when it changes or canvas resizes
  const updateLaptopImage = async () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || !laptop.src) return;

      // Check if laptop layer exists
      let laptopImg = canvas.getObjects().find(obj => obj.id === 'laptop-base');

      try {
        if (!laptopImg || laptopImg.getSrc() !== laptop.src) {
            // Remove old if exists
            if (laptopImg) canvas.remove(laptopImg);

            // Load new image
            const imgEl = await fabric.FabricImage.fromURL(laptop.src);

            imgEl.set({
                id: 'laptop-base',
                selectable: false,
                evented: false, // Don't allow clicking
                opacity: laptop.opacity,
                originX: 'center',
                originY: 'center',
            });

            // Initial positioning
            const center = canvas.getCenter();
            imgEl.set({
                left: center.left,
                top: center.top
            });

            // Scale to fit nicely (80% of canvas)
            const scaleX = (canvas.width * 0.8) / imgEl.width;
            const scaleY = (canvas.height * 0.8) / imgEl.height;
            const scale = Math.min(scaleX, scaleY);

            imgEl.scale(scale);

            canvas.add(imgEl);
            canvas.sendToBack(imgEl);
            canvas.requestRenderAll();
        }
      } catch (err) {
          console.error("Failed to load laptop image", err);
      }
  };

  // Watch for laptop changes
  useEffect(() => {
      updateLaptopImage();
  }, [laptop]);

  // Handle Stickers Sync
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Sync state to canvas

    // 1. Add/Update stickers
    stickers.forEach(async (sticker) => {
        const existing = canvas.getObjects().find(obj => obj.id === sticker.id);

        if (!existing) {
            // Add new sticker
            try {
                const imgEl = await fabric.FabricImage.fromURL(sticker.src);
                imgEl.set({
                    id: sticker.id,
                    left: sticker.left || canvas.width / 2,
                    top: sticker.top || canvas.height / 2,
                    originX: 'center',
                    originY: 'center',
                    cornerColor: 'white',
                    cornerStrokeColor: '#89D888',
                    borderColor: '#89D888',
                    cornerSize: 12,
                    transparentCorners: false,
                    scaleX: sticker.scaleX || 0.5,
                    scaleY: sticker.scaleY || 0.5,
                    angle: sticker.angle || 0,
                    opacity: sticker.opacity ?? 1,
                });
                canvas.add(imgEl);
                canvas.setActiveObject(imgEl);
            } catch (err) {
                console.error("Failed to load sticker", err);
            }
        } else {
             // Update properties
             existing.set({
                 opacity: sticker.opacity ?? existing.opacity,
                 scaleX: sticker.scaleX ?? existing.scaleX,
                 scaleY: sticker.scaleY ?? existing.scaleY,
                 angle: sticker.angle ?? existing.angle,
                 left: sticker.left ?? existing.left,
                 top: sticker.top ?? existing.top,
             });

             // Handle BG removal / Source change
             // Note: setSrc is async, handling it simply here
             if (existing.getSrc() !== sticker.src) {
                 existing.setSrc(sticker.src, () => {
                     canvas.requestRenderAll();
                 });
             }
        }
    });

    // 2. Remove deleted stickers
    const currentIds = stickers.map(s => s.id);
    canvas.getObjects().forEach(obj => {
        if (obj.id !== 'laptop-base' && !currentIds.includes(obj.id)) {
            canvas.remove(obj);
        }
    });

    canvas.requestRenderAll();

  }, [stickers]);

  // Setup Canvas Events
  useEffect(() => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      const handleSelection = (e) => {
          const selected = e.selected || [];
          const ids = selected.map(obj => obj.id);
          useCanvasStore.getState().setSelectedStickers(ids);
      };

      const handleDeselection = () => {
          useCanvasStore.getState().setSelectedStickers([]);
      };

      const handleModified = (e) => {
          const target = e.target;
          if (target && target.id !== 'laptop-base') {
              useCanvasStore.getState().updateSticker(target.id, {
                  left: target.left,
                  top: target.top,
                  scaleX: target.scaleX,
                  scaleY: target.scaleY,
                  angle: target.angle
              });
          }
      };

      canvas.on('selection:created', handleSelection);
      canvas.on('selection:updated', handleSelection);
      canvas.on('selection:cleared', handleDeselection);
      canvas.on('object:modified', handleModified);

      return () => {
          canvas.off('selection:created', handleSelection);
          canvas.off('selection:updated', handleSelection);
          canvas.off('selection:cleared', handleDeselection);
          canvas.off('object:modified', handleModified);
      };
  }, []);

  // Handle Grid
  useEffect(() => {
      // TODO: Implement Grid Overlay
  }, [showGrid]);

  // Handle Export Event
  useEffect(() => {
      const onExport = () => handleExport();
      window.addEventListener('sticker-canvas:export', onExport);
      return () => window.removeEventListener('sticker-canvas:export', onExport);
  }, [handleExport]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-transparent" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
