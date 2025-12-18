import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const DEFAULT_LAPTOP = {
  id: 'macbook-pro-14',
  src: '/laptops/macbook-pro-14.svg',
  isCustom: false,
  opacity: 1,
};

const useCanvasStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Laptop State
        laptop: DEFAULT_LAPTOP,

        // Stickers State
        stickers: [],
        selectedStickerIds: [],

        // UI State
        zoom: 1,
        panOffset: { x: 0, y: 0 },
        showGrid: false,
        snapEnabled: true,
        activeTool: 'select', // 'select' | 'pan'

        // Processing State
        processingQueue: [], // Sticker IDs being processed

        // History (Undo/Redo)
        // Store both stickers and laptop in history
        history: [{ stickers: [], laptop: DEFAULT_LAPTOP }],
        historyIndex: 0,

        // Helper to push state to history
        _pushState: (newStickers, newLaptop) => {
             const { history, historyIndex, stickers, laptop } = get();
             const nextStickers = newStickers || stickers;
             const nextLaptop = newLaptop || laptop;

             const newHistory = history.slice(0, historyIndex + 1);
             newHistory.push({ stickers: nextStickers, laptop: nextLaptop });

             set({
                 stickers: nextStickers,
                 laptop: nextLaptop,
                 history: newHistory.slice(-50),
                 historyIndex: newHistory.length - 1
             });
        },

        // Actions
        setLaptop: (laptop) => {
            const { _pushState } = get();
            _pushState(undefined, laptop);
        },

        addSticker: (sticker) => {
          const { stickers, _pushState } = get();
          const newStickers = [...stickers, sticker];
          _pushState(newStickers);
        },

        updateSticker: (id, updates) => {
          const { stickers, _pushState } = get();
          const newStickers = stickers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          );
          _pushState(newStickers);
        },

        removeSticker: (id) => {
          const { stickers, selectedStickerIds, _pushState } = get();
          const newStickers = stickers.filter((s) => s.id !== id);
          const newSelection = selectedStickerIds.filter((sid) => sid !== id);

          _pushState(newStickers);
          set({ selectedStickerIds: newSelection });
        },

        setSelectedStickers: (ids) => set({ selectedStickerIds: ids }),

        clearSelection: () => set({ selectedStickerIds: [] }),

        setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),

        setPanOffset: (offset) => set({ panOffset: offset }),

        toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

        toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),

        triggerExport: () => {},

        randomizeLayout: () => {
           const { stickers, _pushState } = get();
           const newStickers = stickers.map(s => ({
               ...s,
               left: 100 + Math.random() * 600,
               top: 50 + Math.random() * 400,
               angle: (Math.random() - 0.5) * 30,
               scaleX: s.scaleX * (0.8 + Math.random() * 0.4),
               scaleY: s.scaleY * (0.8 + Math.random() * 0.4)
           }));
           _pushState(newStickers);
        },

        undo: () => {
          const { history, historyIndex } = get();
          if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            set({
              stickers: prevState.stickers,
              laptop: prevState.laptop,
              historyIndex: historyIndex - 1,
            });
          }
        },

        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            set({
              stickers: nextState.stickers,
              laptop: nextState.laptop,
              historyIndex: historyIndex + 1,
            });
          }
        },

        resetCanvas: () => {
            const { _pushState } = get();
            // Reset stickers to empty, keep laptop current or reset?
            // Usually reset clears everything. Let's keep laptop for now as user selected it.
            // But we pass empty array for stickers.
            _pushState([], undefined);
            set({
              selectedStickerIds: [],
              zoom: 1,
              panOffset: { x: 0, y: 0 },
            });
        },
      }),
      {
        name: 'stickercanvas-storage',
        partialize: (state) => ({
          laptop: state.laptop,
          stickers: state.stickers,
        }),
      }
    )
  )
);

export default useCanvasStore;
