"use client";

import { useEffect, useState } from "react";
import { useCollectionStore } from "@/store/collectionStore";
import { swuApi } from "@/lib/api";
import { CardList } from "@/components/card-list";
import { SetSelector } from "@/components/set-selector";
import { CardDetailsModal } from "@/components/card-details-modal";
import { CollectionCard } from "@/types/card";

export default function Home() {
  const {
    currentSet,
    sets,
    isLoading,
    error,
    setCurrentSet,
    setSets,
    setCards,
    setLoading,
    setError,
    updateOwnedQuantity,
    getGroupedCards,
  } = useCollectionStore();

  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load sets on component mount
  useEffect(() => {
    const loadSets = async () => {
      try {
        const availableSets = await swuApi.getSets();
        setSets(availableSets);
      } catch (err) {
        console.error("Error loading sets:", err);
      }
    };
    loadSets();
  }, [setSets]);

  // Load cards when set changes
  useEffect(() => {
    const loadCards = async () => {
      if (!currentSet) return;

      setLoading(true);
      setError(null);

      try {
        const cardsData = await swuApi.getCardsBySet(currentSet);
        setCards(cardsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cards");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [currentSet, setCards, setLoading, setError]);

  const handleSetChange = (setCode: string) => {
    setCurrentSet(setCode);
  };

  const handleQuantityChange = (cardId: string, quantity: number) => {
    updateOwnedQuantity(cardId, quantity);
  };

  const handleCardClick = (card: CollectionCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const groupedCards = getGroupedCards();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Star Wars Unlimited Collection
          </h1>
          <p className="mt-2 text-gray-600">
            Track your card collection and manage your inventory
          </p>
        </div>

        <SetSelector
          sets={sets}
          currentSet={currentSet}
          onSetChange={handleSetChange}
          isLoading={isLoading}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading cards...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Cards in{" "}
                {sets.find((s) => s.code === currentSet)?.name ||
                  currentSet.toUpperCase()}
              </h2>
              <div className="text-sm text-gray-600">
                {groupedCards.length} unique cards
              </div>
            </div>

            <CardList
              cards={groupedCards}
              onQuantityChange={handleQuantityChange}
              onCardClick={handleCardClick}
            />
          </div>
        )}

        <CardDetailsModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </main>
  );
}
