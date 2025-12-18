import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useCanvasStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Laptop State
        laptop: {
          id: 'macbook-pro-14',
          src: '/laptops/macbook-pro-14.svg',
          isCustom: false,
          opacity: 1,
        },

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
        history: [[]], // Start with one empty state
        historyIndex: 0,

        // Helper to push state to history
        _pushState: (newStickers) => {
             const { history, historyIndex } = get();
             const newHistory = history.slice(0, historyIndex + 1);
             newHistory.push(newStickers);
             set({
                 stickers: newStickers,
                 history: newHistory.slice(-50),
                 historyIndex: newHistory.length - 1
             });
        },

        // Actions
        setLaptop: (laptop) => set({ laptop }),

        addSticker: (sticker) => {
          const { stickers, _pushState } = get();
          const newStickers = [...stickers, sticker];
          _pushState(newStickers);
        },

        updateSticker: (id, updates) => {
          const { stickers } = get();
          // We don't push to history on every drag frame (performance).
          // But for panel updates we should.
          // Fabric updates via object:modified are discrete.

          const newStickers = stickers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          );

          // Optimization: If dragging, we might flood history?
          // We rely on caller frequency.
          // For now we push every update.
          // If updateSticker is called rapidly (e.g. slider), we might want to debounce or use separate action.
          // But here we'll just push.

          // To avoid infinite loops with canvas sync, we check if changed?
          // Canvas calls updateSticker on 'modified'.
          // 'modified' happens on mouse up. So it's fine.

          // For slider, it happens on change.
          // We might want to throttle history push for slider?
          // Ignoring for MVP simplicity.

          const { _pushState } = get();
          _pushState(newStickers);
        },

        removeSticker: (id) => {
          const { stickers, selectedStickerIds, _pushState } = get();
          const newStickers = stickers.filter((s) => s.id !== id);
          const newSelection = selectedStickerIds.filter((sid) => sid !== id);

          // Update stickers via pushState
          _pushState(newStickers);
          set({ selectedStickerIds: newSelection });
        },

        setSelectedStickers: (ids) => set({ selectedStickerIds: ids }),

        clearSelection: () => set({ selectedStickerIds: [] }),

        setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),

        setPanOffset: (offset) => set({ panOffset: offset }),

        toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

        toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),

        triggerExport: () => {}, // Handled via event bus, but kept for interface consistency

        // Randomize positions
        randomizeLayout: () => {
           const { stickers, _pushState, laptop } = get();
           // Simple randomize
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
            set({
              stickers: history[historyIndex - 1],
              historyIndex: historyIndex - 1,
            });
          }
        },

        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex < history.length - 1) {
            set({
              stickers: history[historyIndex + 1],
              historyIndex: historyIndex + 1,
            });
          }
        },

        // Reset
        resetCanvas: () => {
            const { _pushState } = get();
            _pushState([]);
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
