import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useCanvasStore = create(
  devtools(
    persist(
      (set, get) => ({
        laptop: {
          id: "macbook-pro-14",
          src: "/laptops/macbook-pro-14.svg",
          isCustom: false,
          opacity: 1,
        },
        stickers: [],
        selectedStickerIds: [],
        stickerLibrary: [],
        zoom: 1,
        panOffset: { x: 0, y: 0 },
        showGrid: false,
        snapEnabled: true,
        activeTool: "select",
        showLaptopSelector: false,
        showStickerLibrary: false,
        showExportPanel: false,
        showStickerControls: false,
        processingQueue: [],
        notifications: [],
        history: [],
        historyIndex: -1,
        maxHistory: 50,

        setLaptop: (laptop) => {
          get().pushToHistory();
          set({ laptop });
        },

        setLaptopOpacity: (opacity) =>
          set((state) => ({
            laptop: { ...state.laptop, opacity },
          })),

        addSticker: (sticker) => {
          get().pushToHistory();
          set((state) => ({
            stickers: [...state.stickers, sticker],
          }));
        },

        addToLibrary: (sticker) =>
          set((state) => ({
            stickerLibrary: [...state.stickerLibrary, sticker],
          })),

        removeFromLibrary: (id) =>
          set((state) => ({
            stickerLibrary: state.stickerLibrary.filter((s) => s.id !== id),
          })),

        updateLibrarySticker: (id, updates) =>
          set((state) => ({
            stickerLibrary: state.stickerLibrary.map((s) =>
              s.id === id ? { ...s, ...updates } : s,
            ),
          })),

        updateSticker: (id, updates) => {
          set((state) => ({
            stickers: state.stickers.map((s) =>
              s.id === id ? { ...s, ...updates } : s,
            ),
          }));
        },

        updateStickerWithHistory: (id, updates) => {
          get().pushToHistory();
          set((state) => ({
            stickers: state.stickers.map((s) =>
              s.id === id ? { ...s, ...updates } : s,
            ),
          }));
        },

        removeSticker: (id) => {
          get().pushToHistory();
          set((state) => ({
            stickers: state.stickers.filter((s) => s.id !== id),
            selectedStickerIds: state.selectedStickerIds.filter(
              (sid) => sid !== id,
            ),
          }));
        },

        duplicateSticker: (id) => {
          const { stickers } = get();
          const sticker = stickers.find((s) => s.id === id);
          if (sticker) {
            const newSticker = {
              ...sticker,
              id: crypto.randomUUID(),
              left: sticker.left + 20,
              top: sticker.top + 20,
            };
            get().pushToHistory();
            set((state) => ({
              stickers: [...state.stickers, newSticker],
              selectedStickerIds: [newSticker.id],
            }));
          }
        },

        setSelectedStickers: (ids) => set({ selectedStickerIds: ids }),

        addToSelection: (id) =>
          set((state) => ({
            selectedStickerIds: state.selectedStickerIds.includes(id)
              ? state.selectedStickerIds
              : [...state.selectedStickerIds, id],
          })),

        clearSelection: () => set({ selectedStickerIds: [] }),

        selectAll: () =>
          set((state) => ({
            selectedStickerIds: state.stickers.map((s) => s.id),
          })),

        bringToFront: (id) => {
          get().pushToHistory();
          set((state) => {
            const maxZ = Math.max(...state.stickers.map((s) => s.zIndex || 0));
            return {
              stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, zIndex: maxZ + 1 } : s,
              ),
            };
          });
        },

        sendToBack: (id) => {
          get().pushToHistory();
          set((state) => {
            const minZ = Math.min(...state.stickers.map((s) => s.zIndex || 0));
            return {
              stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, zIndex: minZ - 1 } : s,
              ),
            };
          });
        },

        bringForward: (id) => {
          get().pushToHistory();
          set((state) => {
            const sticker = state.stickers.find((s) => s.id === id);
            if (!sticker) return state;
            const currentZ = sticker.zIndex || 0;
            return {
              stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, zIndex: currentZ + 1 } : s,
              ),
            };
          });
        },

        sendBackward: (id) => {
          get().pushToHistory();
          set((state) => {
            const sticker = state.stickers.find((s) => s.id === id);
            if (!sticker) return state;
            const currentZ = sticker.zIndex || 0;
            return {
              stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, zIndex: currentZ - 1 } : s,
              ),
            };
          });
        },

        setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),

        zoomIn: () =>
          set((state) => ({
            zoom: Math.min(4, state.zoom + 0.1),
          })),

        zoomOut: () =>
          set((state) => ({
            zoom: Math.max(0.25, state.zoom - 0.1),
          })),

        resetZoom: () => set({ zoom: 1 }),

        setPanOffset: (offset) => set({ panOffset: offset }),

        toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

        toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),

        setActiveTool: (tool) => set({ activeTool: tool }),

        toggleLaptopSelector: () =>
          set((state) => ({
            showLaptopSelector: !state.showLaptopSelector,
            showStickerLibrary: false,
            showExportPanel: false,
          })),

        toggleStickerLibrary: () =>
          set((state) => ({
            showStickerLibrary: !state.showStickerLibrary,
            showLaptopSelector: false,
            showExportPanel: false,
          })),

        toggleExportPanel: () =>
          set((state) => ({
            showExportPanel: !state.showExportPanel,
            showLaptopSelector: false,
            showStickerLibrary: false,
          })),

        closePanels: () =>
          set({
            showLaptopSelector: false,
            showStickerLibrary: false,
            showExportPanel: false,
          }),

        setShowStickerControls: (show) => set({ showStickerControls: show }),

        addToProcessingQueue: (id) =>
          set((state) => ({
            processingQueue: [...state.processingQueue, id],
          })),

        removeFromProcessingQueue: (id) =>
          set((state) => ({
            processingQueue: state.processingQueue.filter((pid) => pid !== id),
          })),

        addNotification: (notification) => {
          const id = crypto.randomUUID();
          set((state) => ({
            notifications: [...state.notifications, { ...notification, id }],
          }));
          if (notification.duration !== 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, notification.duration || 3000);
          }
          return id;
        },

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        randomizeLayout: () => {
          const { stickers } = get();
          if (stickers.length === 0) return;

          get().pushToHistory();

          const safeZone = {
            minX: 100,
            maxX: 700,
            minY: 100,
            maxY: 400,
          };

          const newStickers = stickers.map((sticker) => {
            const randomX =
              safeZone.minX + Math.random() * (safeZone.maxX - safeZone.minX);
            const randomY =
              safeZone.minY + Math.random() * (safeZone.maxY - safeZone.minY);
            const randomAngle = (Math.random() - 0.5) * 30;
            const randomScale = 0.8 + Math.random() * 0.4;

            return {
              ...sticker,
              left: randomX,
              top: randomY,
              angle: randomAngle,
              scaleX: (sticker.scaleX || 1) * randomScale,
              scaleY: (sticker.scaleY || 1) * randomScale,
            };
          });

          set({ stickers: newStickers });
        },

        pushToHistory: () => {
          const { stickers, history, historyIndex, maxHistory } = get();
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(stickers)));
          set({
            history: newHistory.slice(-maxHistory),
            historyIndex: Math.min(newHistory.length - 1, maxHistory - 1),
          });
        },

        undo: () => {
          const { history, historyIndex, stickers } = get();
          if (historyIndex >= 0) {
            if (historyIndex === history.length - 1) {
              const newHistory = [
                ...history,
                JSON.parse(JSON.stringify(stickers)),
              ];
              set({
                stickers: history[historyIndex],
                history: newHistory,
                historyIndex: historyIndex - 1,
                selectedStickerIds: [],
              });
            } else {
              set({
                stickers: history[historyIndex],
                historyIndex: historyIndex - 1,
                selectedStickerIds: [],
              });
            }
          }
        },

        redo: () => {
          const { history, historyIndex } = get();
          if (historyIndex < history.length - 1) {
            set({
              stickers: history[historyIndex + 1],
              historyIndex: historyIndex + 1,
              selectedStickerIds: [],
            });
          }
        },

        canUndo: () => {
          const { historyIndex } = get();
          return historyIndex >= 0;
        },

        canRedo: () => {
          const { history, historyIndex } = get();
          return historyIndex < history.length - 1;
        },

        resetCanvas: () => {
          get().pushToHistory();
          set({
            stickers: [],
            selectedStickerIds: [],
            zoom: 1,
            panOffset: { x: 0, y: 0 },
          });
        },

        deleteSelected: () => {
          const { selectedStickerIds } = get();
          if (selectedStickerIds.length > 0) {
            get().pushToHistory();
            set((state) => ({
              stickers: state.stickers.filter(
                (s) => !selectedStickerIds.includes(s.id),
              ),
              selectedStickerIds: [],
            }));
          }
        },
      }),
      {
        name: "stickercanvas-storage",
        partialize: (state) => ({
          laptop: state.laptop,
          stickers: state.stickers,
          stickerLibrary: state.stickerLibrary,
        }),
      },
    ),
  ),
);

export default useCanvasStore;
