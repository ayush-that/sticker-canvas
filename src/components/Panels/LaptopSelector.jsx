import { Laptop, UploadSimple } from '@phosphor-icons/react';
import useCanvasStore from '../../store/canvasStore';
import clsx from 'clsx';
import { useFileUpload } from '../../hooks/useFileUpload';

const LAPTOPS = [
  { id: 'macbook-pro-14', name: 'MBP 14"', src: '/laptops/macbook-pro-14.svg' },
  { id: 'generic-silver', name: 'Generic Silver', src: '/laptops/macbook-pro-14.svg' },
];

export default function LaptopSelector() {
  const currentLaptop = useCanvasStore(state => state.laptop);
  const setLaptop = useCanvasStore(state => state.setLaptop);

  const { inputRef, handleClick, inputProps } = useFileUpload((files) => {
    if(files[0]) {
        const src = URL.createObjectURL(files[0]);
        setLaptop({
            id: 'custom-' + Date.now(),
            src,
            isCustom: true,
            opacity: 1
        });
    }
  });

  return (
    <div className="w-80 rounded-2xl bg-bg-elevated/85 backdrop-blur-md border border-border-subtle shadow-elevated overflow-hidden flex flex-col pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <h3 className="text-sm font-medium text-text-secondary">Laptop</h3>
            <button
                className="text-xs text-accent-primary hover:text-accent-primary-hover flex items-center gap-1 font-medium transition-colors"
                onClick={handleClick}
            >
                <UploadSimple size={14} weight="bold" />
                Upload Custom
            </button>
            <input {...inputProps} />
        </div>

        <div className="p-3 grid grid-cols-3 gap-2">
            {LAPTOPS.map(laptop => (
                <button
                    key={laptop.id}
                    className={clsx(
                        "aspect-[3/2] rounded-lg border flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden group",
                        currentLaptop.id === laptop.id
                            ? "bg-accent-primary/10 border-accent-primary text-accent-primary"
                            : "bg-white/5 border-transparent hover:bg-white/10 text-text-muted hover:text-text-primary"
                    )}
                    onClick={() => setLaptop({ ...laptop, isCustom: false, opacity: 1 })}
                >
                    <Laptop size={24} weight={currentLaptop.id === laptop.id ? "fill" : "regular"} />
                    <span className="text-[10px] font-medium">{laptop.name}</span>
                </button>
            ))}

             {currentLaptop.isCustom && (
                 <button
                    className="aspect-[3/2] rounded-lg border border-accent-primary bg-accent-primary/10 text-accent-primary flex flex-col items-center justify-center gap-1"
                >
                    <img src={currentLaptop.src} className="w-8 h-8 object-contain" />
                    <span className="text-[10px] font-medium">Custom</span>
                </button>
             )}
        </div>
    </div>
  );
}
