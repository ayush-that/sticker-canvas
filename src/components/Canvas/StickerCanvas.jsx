import { useEffect, useRef, useCallback } from "react";
import { fabric } from "fabric";
import useCanvasStore from "../../store/canvasStore";
import CanvasControls from "./CanvasControls";
import GridOverlay from "./GridOverlay";

export default function StickerCanvas() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const laptopObjectRef = useRef(null);

  const {
    laptop,
    stickers,
    selectedStickerIds,
    zoom,
    showGrid,
    setSelectedStickers,
    updateSticker,
    clearSelection,
    addNotification,
  } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    window.__fabricCanvas = canvas;

    canvas.on("selection:created", (e) => {
      const ids =
        e.selected
          ?.filter((obj) => obj.stickerId)
          .map((obj) => obj.stickerId) || [];
      setSelectedStickers(ids);
    });

    canvas.on("selection:updated", (e) => {
      const ids =
        e.selected
          ?.filter((obj) => obj.stickerId)
          .map((obj) => obj.stickerId) || [];
      setSelectedStickers(ids);
    });

    canvas.on("selection:cleared", () => {
      clearSelection();
    });

    canvas.on("object:modified", (e) => {
      const obj = e.target;
      if (obj && obj.stickerId) {
        updateSticker(obj.stickerId, {
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          flipX: obj.flipX,
          flipY: obj.flipY,
        });
      }
    });

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
      window.__fabricCanvas = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    const center = canvas.getCenter();
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
    canvas.renderAll();
  }, [zoom]);

  useEffect(() => {
    if (!fabricRef.current || !laptop.src) return;
    const canvas = fabricRef.current;

    if (laptopObjectRef.current) {
      canvas.remove(laptopObjectRef.current);
    }

    fabric.Image.fromURL(
      laptop.src,
      (img) => {
        if (!img) {
          addNotification({
            message: "Failed to load laptop image",
            type: "error",
          });
          return;
        }

        const maxWidth = window.innerWidth * 0.6;
        const maxHeight = window.innerHeight * 0.7;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

        img.set({
          scaleX: scale,
          scaleY: scale,
          left: window.innerWidth / 2,
          top: window.innerHeight / 2,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
          opacity: laptop.opacity,
          laptopLayer: true,
        });

        laptopObjectRef.current = img;
        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll();
      },
      { crossOrigin: "anonymous" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [laptop.src, laptop.opacity]);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    const existingObjects = canvas.getObjects().filter((obj) => obj.stickerId);

    existingObjects.forEach((obj) => {
      if (!stickers.find((s) => s.id === obj.stickerId)) {
        canvas.remove(obj);
      }
    });

    stickers.forEach((sticker) => {
      const existingObj = existingObjects.find(
        (obj) => obj.stickerId === sticker.id,
      );

      if (existingObj) {
        existingObj.set({
          left: sticker.left,
          top: sticker.top,
          scaleX: sticker.scaleX || 1,
          scaleY: sticker.scaleY || 1,
          angle: sticker.angle || 0,
          opacity: sticker.opacity || 1,
          flipX: sticker.flipX || false,
          flipY: sticker.flipY || false,
          selectable: !sticker.locked,
          evented: !sticker.locked,
        });
        existingObj.setCoords();
      } else {
        fabric.Image.fromURL(
          sticker.src,
          (img) => {
            if (!img) return;

            const maxSize = 150;
            const scale = Math.min(
              maxSize / img.width,
              maxSize / img.height,
              1,
            );

            img.set({
              left: sticker.left || 300,
              top: sticker.top || 200,
              scaleX: (sticker.scaleX || 1) * scale,
              scaleY: (sticker.scaleY || 1) * scale,
              angle: sticker.angle || 0,
              opacity: sticker.opacity || 1,
              flipX: sticker.flipX || false,
              flipY: sticker.flipY || false,
              originX: "center",
              originY: "center",
              stickerId: sticker.id,
              selectable: !sticker.locked,
              evented: !sticker.locked,
              cornerColor: "#89D888",
              cornerStyle: "circle",
              cornerSize: 10,
              transparentCorners: false,
              borderColor: "#89D888",
              borderScaleFactor: 2,
            });

            canvas.add(img);

            const sortedStickers = [...stickers].sort(
              (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
            );
            sortedStickers.forEach((s) => {
              const obj = canvas.getObjects().find((o) => o.stickerId === s.id);
              if (obj) {
                canvas.bringToFront(obj);
              }
            });

            canvas.renderAll();
          },
          { crossOrigin: "anonymous" },
        );
      }
    });

    canvas.renderAll();
  }, [stickers]);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    if (selectedStickerIds.length === 0) {
      canvas.discardActiveObject();
    } else {
      const objectsToSelect = canvas
        .getObjects()
        .filter(
          (obj) => obj.stickerId && selectedStickerIds.includes(obj.stickerId),
        );

      if (objectsToSelect.length === 1) {
        canvas.setActiveObject(objectsToSelect[0]);
      } else if (objectsToSelect.length > 1) {
        const selection = new fabric.ActiveSelection(objectsToSelect, {
          canvas,
        });
        canvas.setActiveObject(selection);
      }
    }

    canvas.renderAll();
  }, [selectedStickerIds]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);

      files.forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const sticker = {
            id: crypto.randomUUID(),
            src: event.target.result,
            originalSrc: event.target.result,
            name: file.name,
            bgRemoved: false,
            processing: false,
          };
          useCanvasStore.getState().addToLibrary(sticker);
          useCanvasStore.getState().toggleStickerLibrary();
          addNotification({
            message: `Added ${file.name} to library`,
            type: "success",
          });
        };
        reader.readAsDataURL(file);
      });
    },
    [addNotification],
  );

  return (
    <div
      id="sticker-canvas"
      className="absolute inset-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas ref={canvasRef} />
      {showGrid && <GridOverlay />}
      <CanvasControls />
    </div>
  );
}
