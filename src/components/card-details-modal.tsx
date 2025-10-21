"use client";

import Image from "next/image";
import { useState } from "react";
import { CollectionCard } from "@/types/card";

interface CardDetailsModalProps {
  card: CollectionCard | null;
  isOpen: boolean;
  onClose: () => void;
  onQuantityChange: (cardId: string, quantity: number) => void;
}

export function CardDetailsModal({
  card,
  isOpen,
  onClose,
  onQuantityChange,
}: CardDetailsModalProps) {
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  if (!isOpen || !card) return null;

  const handleQuantityEdit = (variantId: string, currentQuantity: number) => {
    setEditingVariant(variantId);
    setTempQuantity(currentQuantity);
  };

  const handleQuantitySave = (variantId: string) => {
    onQuantityChange(variantId, tempQuantity);
    setEditingVariant(null);
  };

  const handleQuantityCancel = () => {
    setEditingVariant(null);
  };

  const variants = card.card.artVariants ?? [];

  const totalOwned =
    variants.reduce((sum) => {
      // For now, we'll assume each variant has the same owned quantity as the main card
      // In a more sophisticated implementation, we'd track quantities per variant
      return sum + card.owned;
    }, 0) || card.owned;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {card.card.name}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>Set: {card.card.set.toUpperCase()}</span>
                <span>Type: {card.card.type}</span>
                <span>Rarity: {card.card.rarity}</span>
                {card.card.cost !== undefined && (
                  <span>Cost: {card.card.cost}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Total Owned: {totalOwned}
              </h3>
            </div>
          </div>

          {variants.length > 1 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Art Variants</h3>
              <div className="space-y-3">
                {variants.map((variant, index) => {
                  const isEditing = editingVariant === variant.id;

                  return (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {variant.imageUrl && (
                          <Image
                            src={variant.imageUrl}
                            alt={`${card.card.name} variant ${index + 1}`}
                            width={64}
                            height={80}
                            className="w-16 h-20 object-cover rounded border"
                            unoptimized
                          />
                        )}
                        <div>
                          <div className="font-medium">Variant {index + 1}</div>
                          <div className="text-sm text-gray-600">
                            Card Number: {variant.number}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
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
                            />
                            <button
                              onClick={() => handleQuantitySave(variant.id)}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleQuantityCancel}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-[2rem] text-right">
                              {card.owned}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityEdit(variant.id, card.owned)
                              }
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
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No additional art variants available for this card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
