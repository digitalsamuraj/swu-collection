"use client";

import { useState } from "react";
import { CollectionCard } from "@/types/card";

interface CardListProps {
  cards: CollectionCard[];
  onQuantityChange: (cardId: string, quantity: number) => void;
  onCardClick: (card: CollectionCard) => void;
}

export function CardList({
  cards,
  onQuantityChange,
  onCardClick,
}: CardListProps) {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  const handleQuantityEdit = (card: CollectionCard) => {
    setEditingCard(card.card.id);
    setTempQuantity(card.owned);
  };

  const handleQuantitySave = (cardId: string) => {
    onQuantityChange(cardId, tempQuantity);
    setEditingCard(null);
  };

  const handleQuantityCancel = () => {
    setEditingCard(null);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No cards found for this set.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cards.map((collectionCard) => {
        const { card, owned } = collectionCard;
        const isEditing = editingCard === card.id;
        const hasMultipleVariants =
          card.artVariants && card.artVariants.length > 1;

        return (
          <div
            key={card.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => onCardClick(collectionCard)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-500">
                  {card.number}
                </span>
                <h3 className="font-medium text-gray-900 truncate">
                  {card.name}
                </h3>
                {hasMultipleVariants && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {card.artVariants!.length} variants
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{card.type}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{card.rarity}</span>
                {card.cost !== undefined && (
                  <>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      Cost: {card.cost}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={tempQuantity}
                    onChange={(e) =>
                      setTempQuantity(parseInt(e.target.value) || 0)
                    }
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleQuantitySave(card.id);
                      } else if (e.key === "Escape") {
                        handleQuantityCancel();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantitySave(card.id);
                    }}
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityCancel();
                    }}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-right">
                    {owned}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityEdit(collectionCard);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
