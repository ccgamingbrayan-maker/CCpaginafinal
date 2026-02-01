// src/components/TCGProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { categories } from '../data/categories';  // ✅ Categorías normales
import { tcgApiCategories } from '../data/categories';
import { toast } from 'react-toastify';

const tcgProductSchema = z.object({
  price: z.number().min(0.01, 'Price must be greater than 0'),
  desc: z.string().optional(),
  category: z.string().min(1, 'Category is required'),  // ✅ Nueva validación
});

type TCGProductFormData = z.infer<typeof tcgProductSchema>;

interface TCGProductFormProps {
  onSubmit: (data: { name: string; image_url: string; price: number; description: string; category: string }) => void;
  onCancel: () => void;
}

const TCGProductForm: React.FC<TCGProductFormProps> = ({ onSubmit, onCancel }) => {
  const [selectedTCGCategory, setSelectedTCGCategory] = useState(tcgApiCategories[0]);
  const [selectedCategory, setSelectedCategory] = useState('Trading Cards');  // ✅ Default Trading Cards
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchById, setSearchById] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TCGProductFormData>({
    resolver: zodResolver(tcgProductSchema),
    defaultValues: {
      category: 'Trading Cards',  // ✅ Default
    }
  });

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (!selectedTCGCategory || !selectedTCGCategory.endpoint) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      const finalEndpoint = `${selectedTCGCategory.endpoint}?${searchById ? 'id' : 'name'}=${encodeURIComponent(searchQuery)}`;

      try {
        const response = await fetch(finalEndpoint, {
          headers: {
            'x-api-key': '79ad473ec4732427d64f7090dce2ced8e387d84850af8ba6c2544c4d369414c1'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults(
            data.data.map((card: any) => ({
              id: card.id || card.uuid || card._id || `${card.name}-${Math.random()}`,
              name: card.name,
              image: card.image || card.images?.[0] || card.imageUrl || card.images?.small || '',
              description: card.text || card.description || card.flavorText || ''
            }))
          );
        } else {
          toast.error('Failed to search cards');
        }
      } catch (error) {
        toast.error('Error searching cards. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTCGCategory, searchById]);

  const handleFormSubmit = async (data: TCGProductFormData) => {
    if (!selectedCard) {
      toast.error('Please select a card first');
      return;
    }

    try {
      await onSubmit({
        name: selectedCard.name,
        image_url: selectedCard.image,
        price: data.price,
        description: data.desc || selectedCard.description || '',
        category: data.category,  // ✅ Usa la categoría seleccionada
      });
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Add Product from TCG API</h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* TCG Category Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TCG Source
          </label>
          <select
            value={selectedTCGCategory.name}
            onChange={(e) => {
              const category = tcgApiCategories.find(cat => cat.name === e.target.value);
              if (category) {
                setSelectedTCGCategory(category);
                setSearchResults([]);
                setSelectedCard(null);
                setSearchQuery('');
              }
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
          >
            {tcgApiCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {selectedTCGCategory && !selectedTCGCategory.endpoint && (
            <p className="text-amber-600 text-sm mt-1.5 bg-amber-50 p-2 rounded">
              This category is coming soon.
            </p>
          )}
        </div>

        {/* Product Category Selector ✅ NUEVO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Category
          </label>
          <select
            {...register('category')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
          >
            <option value="">Select store category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1.5">{errors.category.message}</p>
          )}
        </div>

        {/* Search Cards */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Cards
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Type to search cards..."
              disabled={!selectedTCGCategory || !selectedTCGCategory.endpoint}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Search by ID Toggle */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={searchById}
              onChange={() => setSearchById(p => !p)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <label className="text-sm text-gray-700">Search by ID</label>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-3 max-h-96 overflow-y-auto">
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
                {searchResults.map((card) => {
                  const isSelected = selectedCard?.id === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedCard(card)}
                      className={`group p-3 rounded-lg border transition-all overflow-hidden hover:shadow-md ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md'
                          : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {card.image && (
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-full h-32 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-200"
                        />
                      )}
                      <p className={`text-sm font-semibold line-clamp-2 ${
                        isSelected ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {card.name}
                      </p>
                      {card.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {card.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected Card Preview */}
        {selectedCard && (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border-2 border-blue-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Selected: {selectedCard.name}
            </p>
            <div className="flex items-start gap-4">
              {selectedCard.image && (
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-20 h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">
                  {selectedCard.name}
                </p>
                {selectedCard.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                    {selectedCard.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            id="price"
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1.5">{errors.price.message}</p>
          )}
        </div>

        {/* Additional Description */}
        <div>
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Description (Optional)
          </label>
          <textarea
            id="desc"
            rows={3}
            {...register('desc')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none shadow-sm"
            placeholder="Add extra details about this product..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || !selectedCard}
            className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white py-3 px-6 rounded-xl hover:from-primary/90 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Adding...
              </>
            ) : (
              'Add Product'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TCGProductForm;
