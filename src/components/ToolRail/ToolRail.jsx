import {
  Plus,
  Laptop,
  Shuffle,
  GridFour,
  ArrowUUpLeft,
  ArrowUUpRight,
  Gear
} from '@phosphor-icons/react';
import useCanvasStore from '../../store/canvasStore';
import clsx from 'clsx';
import { useFileUpload } from '../../hooks/useFileUpload';
import { v4 as uuidv4 } from 'uuid';

function ToolButton({ icon: Icon, label, shortcut, onClick, active }) {
  return (
    <button
      className={clsx(
        "w-11 h-11 rounded-xl bg-transparent border-none text-text-secondary grid place-items-center cursor-pointer transition-all hover:bg-bg-surface-hover hover:text-white group relative",
        active && "bg-[rgba(137,216,136,0.15)] text-accent-primary"
      )}
      onClick={onClick}
      aria-label={label}
      title={`${label} ${shortcut ? `(${shortcut})` : ''}`}
    >
      <Icon size={20} weight={active ? "fill" : "regular"} />

      {/* Tooltip */}
      <span className="absolute left-full ml-3 px-2 py-1 bg-bg-elevated border border-border-subtle rounded-md text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {label}
        {shortcut && <span className="ml-2 text-text-muted">{shortcut}</span>}
      </span>
    </button>
  );
}

export default function ToolRail() {
  const toggleGrid = useCanvasStore(state => state.toggleGrid);
  const showGrid = useCanvasStore(state => state.showGrid);
  const randomize = useCanvasStore(state => state.randomizeLayout);
  const undo = useCanvasStore(state => state.undo);
  const redo = useCanvasStore(state => state.redo);
  const addSticker = useCanvasStore(state => state.addSticker);

  const { inputRef, handleClick, handleChange, inputProps } = useFileUpload((files) => {
    files.forEach(file => {
      const stickerId = uuidv4();
      const objectURL = URL.createObjectURL(file);

      // Add sticker immediately with "processing" flag or similar if we were handling state here.
      // But since we want auto-remove, we might want to do it before adding?
      // Or add it, and let a component handle the processing.
      // For now, let's just add it. The BG removal will be triggered manually or we can add a "processing" status to sticker.

      addSticker({
        id: stickerId,
        src: objectURL,
        originalSrc: objectURL, // Keep original
        originalFile: file,
        bgRemoved: false,
        processing: false, // Could trigger auto-processing
        x: 0,
        y: 0,
        scale: 0.5,
        rotation: 0,
        opacity: 1
      });
    });
  });

  return (
    <aside className="fixed left-5 top-1/2 -translate-y-1/2 w-16 flex flex-col items-center gap-2 p-3 rounded-[32px] bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-border-subtle shadow-soft z-40">
      {/* Primary Action */}
      <button
        className="w-12 h-12 rounded-full bg-white text-black grid place-items-center border-none cursor-pointer hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] transition-all mb-2"
        aria-label="Add Sticker"
        onClick={handleClick}
      >
        <Plus size={24} weight="bold" />
      </button>
      <input {...inputProps} />

      {/* Divider */}
      <div className="w-8 h-[1px] bg-border-subtle my-1" />

      {/* Tool Icons */}
      <nav className="flex flex-col gap-1 w-full items-center">
        <ToolButton icon={Laptop} label="Change Laptop" shortcut="L" />
        <ToolButton icon={Shuffle} label="Randomize" shortcut="R" onClick={randomize} />
        <ToolButton icon={GridFour} label="Toggle Grid" shortcut="G" onClick={toggleGrid} active={showGrid} />
        <ToolButton icon={ArrowUUpLeft} label="Undo" shortcut="Ctrl+Z" onClick={undo} />
        <ToolButton icon={ArrowUUpRight} label="Redo" shortcut="Ctrl+Shift+Z" onClick={redo} />
      </nav>

      {/* Spacer */}
      <div className="flex-grow min-h-[16px]" />

      {/* Bottom Section */}
      <button
        className="w-10 h-10 rounded-xl text-text-muted hover:text-text-primary transition-colors grid place-items-center"
        aria-label="Settings"
      >
        <Gear size={20} />
      </button>
    </aside>
  );
}
