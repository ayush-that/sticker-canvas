import React, { useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import FloatingPanel from '../UI/FloatingPanel';
import useCanvasStore from '../../store/canvasStore';

const LAPTOP_TEMPLATES = [
  { id: 'macbook-pro-14', name: 'MacBook Pro 14"', src: '/laptops/macbook-pro-14.svg' },
  { id: 'macbook-air-m2', name: 'MacBook Air M2', src: '/laptops/macbook-air-m2.svg' },
  { id: 'dell-xps-15', name: 'Dell XPS 15', src: '/laptops/dell-xps-15.svg' },
  { id: 'thinkpad-x1', name: 'ThinkPad X1', src: '/laptops/thinkpad-x1.svg' },
  { id: 'generic-silver', name: 'Generic Silver', src: '/laptops/generic-silver.svg' },
  { id: 'generic-black', name: 'Generic Black', src: '/laptops/generic-black.svg' },
];

export default function LaptopSelector() {
  const fileInputRef = useRef(null);
  const { laptop, setLaptop, toggleLaptopSelector, addNotification } = useCanvasStore();

  const handleSelectTemplate = (template) => {
    setLaptop({
      id: template.id,
      src: template.src,
      isCustom: false,
      opacity: 1,
    });
    addNotification({
      message: `Selected ${template.name}`,
      type: 'success',
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification({
        message: 'Please select an image file',
        type: 'error',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        message: 'Image is too large (max 10MB)',
        type: 'error',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setLaptop({
        id: 'custom',
        src: event.target.result,
        isCustom: true,
        opacity: 1,
        name: file.name,
      });
      addNotification({
        message: 'Custom laptop image loaded',
        type: 'success',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <FloatingPanel
      title="Choose Laptop"
      onClose={toggleLaptopSelector}
      position="bottom-left"
      width={340}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        className="
          w-full flex items-center justify-center gap-2 p-3 mb-3
          rounded-md border-2 border-dashed border-border-medium
          text-text-secondary text-sm
          hover:border-accent hover:text-accent
          transition-colors duration-fast
        "
      >
        <Upload size={18} />
        <span>Upload your own laptop</span>
      </button>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-2">
        {LAPTOP_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={`
              relative p-2 rounded-md
              border transition-all duration-fast
              ${laptop.id === template.id
                ? 'border-accent bg-accent/10'
                : 'border-border-subtle hover:border-border-medium bg-surface hover:bg-surface-hover'
              }
            `}
          >
            <div className="aspect-[4/3] bg-black/30 rounded flex items-center justify-center mb-2 overflow-hidden">
              <img
                src={template.src}
                alt={template.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center text-text-muted text-xs">
                Preview
              </div>
            </div>
            <span className="text-xs text-text-secondary block truncate">
              {template.name}
            </span>
            {laptop.id === template.id && (
              <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <Check size={12} className="text-text-inverse" />
              </div>
            )}
          </button>
        ))}
      </div>
    </FloatingPanel>
  );
}
