import React, { useRef } from 'react';
import {
  Plus,
  Image,
  Shuffle,
  Grid3x3,
  Magnet,
  Undo2,
  Redo2,
  RotateCcw,
  Settings,
} from 'lucide-react';
import ToolButton from './ToolButton';
import useCanvasStore from '../../store/canvasStore';

export default function ToolRail() {
  const fileInputRef = useRef(null);
  const {
    toggleLaptopSelector,
    toggleStickerLibrary,
    toggleGrid,
    toggleSnap,
    showGrid,
    snapEnabled,
    undo,
    redo,
    randomizeLayout,
    resetCanvas,
    addToLibrary,
    addNotification,
    showLaptopSelector,
    showStickerLibrary,
  } = useCanvasStore();

  const handleAddSticker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        addNotification({
          message: `${file.name} is not an image`,
          type: 'error',
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        addNotification({
          message: `${file.name} is too large (max 5MB)`,
          type: 'error',
        });
        continue;
      }

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
        addToLibrary(sticker);
        addNotification({
          message: `Added ${file.name} to library`,
          type: 'success',
        });
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    e.target.value = '';

    // Show library panel
    if (!showStickerLibrary) {
      toggleStickerLibrary();
    }
  };

  return (
    <aside
      className="
        fixed left-[18px] top-1/2 -translate-y-1/2 z-40
        flex flex-col items-center gap-2 p-3
        rounded-[32px] glass-surface
      "
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Primary Action - Add Sticker */}
      <button
        onClick={handleAddSticker}
        className="
          w-12 h-12 rounded-full
          bg-white text-black
          flex items-center justify-center
          transition-all duration-fast
          hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)]
        "
        title="Add Sticker (S)"
        aria-label="Add Sticker"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {/* Divider */}
      <div className="w-8 h-px bg-border-medium my-1" />

      {/* Tool Buttons */}
      <nav className="flex flex-col gap-1">
        <ToolButton
          icon={Image}
          label="Change Laptop"
          shortcut="L"
          onClick={toggleLaptopSelector}
          active={showLaptopSelector}
        />
        <ToolButton
          icon={Shuffle}
          label="Randomize"
          shortcut="R"
          onClick={randomizeLayout}
        />
        <ToolButton
          icon={Magnet}
          label="Toggle Snap"
          shortcut="G"
          onClick={toggleSnap}
          active={snapEnabled}
        />
        <ToolButton
          icon={Grid3x3}
          label="Toggle Grid"
          shortcut="⇧G"
          onClick={toggleGrid}
          active={showGrid}
        />

        {/* Divider */}
        <div className="w-8 h-px bg-border-medium my-1 self-center" />

        <ToolButton
          icon={Undo2}
          label="Undo"
          shortcut="⌘Z"
          onClick={undo}
        />
        <ToolButton
          icon={Redo2}
          label="Redo"
          shortcut="⌘⇧Z"
          onClick={redo}
        />
        <ToolButton
          icon={RotateCcw}
          label="Reset Canvas"
          shortcut="⌘R"
          onClick={resetCanvas}
        />
      </nav>

      {/* Spacer */}
      <div className="flex-grow min-h-4" />

      {/* Settings (placeholder) */}
      <ToolButton
        icon={Settings}
        label="Settings"
        onClick={() => addNotification({ message: 'Settings coming soon', type: 'info' })}
      />
    </aside>
  );
}
