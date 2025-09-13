import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Card, CollectionCard, Set } from "@/types/card";

interface CollectionState {
  // Current set being viewed
  currentSet: string;
  sets: Set[];

  // Cards data
  cards: Card[];
  isLoading: boolean;
  error: string | null;

  // Collection data (owned quantities)
  collection: Record<string, number>; // cardId -> owned quantity

  // Actions
  setCurrentSet: (setCode: string) => void;
  setSets: (sets: Set[]) => void;
  setCards: (cards: Card[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateOwnedQuantity: (cardId: string, quantity: number) => void;
  getOwnedQuantity: (cardId: string) => number;
  getCollectionCards: () => CollectionCard[];
  getGroupedCards: () => CollectionCard[];
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSet: "sor",
      sets: [],
      cards: [],
      isLoading: false,
      error: null,
      collection: {},

      // Actions
      setCurrentSet: (setCode: string) => set({ currentSet: setCode }),

      setSets: (sets: Set[]) => set({ sets }),

      setCards: (cards: Card[]) => set({ cards }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      updateOwnedQuantity: (cardId: string, quantity: number) =>
        set((state) => ({
          collection: {
            ...state.collection,
            [cardId]: Math.max(0, quantity), // Ensure non-negative
          },
        })),

      getOwnedQuantity: (cardId: string) => {
        const state = get();
        return state.collection[cardId] || 0;
      },

      getCollectionCards: () => {
        const state = get();
        return state.cards.map((card) => ({
          card,
          owned: state.collection[card.id] || 0,
        }));
      },

      getGroupedCards: () => {
        const state = get();
        const grouped = new Map<string, CollectionCard>();

        state.cards.forEach((card) => {
          // Group by name and set number (excluding art variant differences)
          const groupKey = `${card.name}-${card.set}-${card.number}`;

          if (grouped.has(groupKey)) {
            const existing = grouped.get(groupKey)!;
            existing.owned += state.collection[card.id] || 0;

            // Add art variant info
            if (!existing.card.artVariants) {
              existing.card.artVariants = [];
            }
            existing.card.artVariants.push({
              id: card.id,
              number: card.number,
              imageUrl: card.imageUrl,
            });
          } else {
            grouped.set(groupKey, {
              card: {
                ...card,
                artVariants: [
                  {
                    id: card.id,
                    number: card.number,
                    imageUrl: card.imageUrl,
                  },
                ],
              },
              owned: state.collection[card.id] || 0,
            });
          }
        });

        return Array.from(grouped.values()).sort((a, b) =>
          a.card.number.localeCompare(b.card.number, undefined, {
            numeric: true,
          })
        );
      },
    }),
    {
      name: "swu-collection-storage",
      partialize: (state) => ({
        collection: state.collection,
        currentSet: state.currentSet,
      }),
    }
  )
);
