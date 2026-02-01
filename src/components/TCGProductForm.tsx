import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { tcgApiCategories } from '../data/categories';
import { toast } from 'react-toastify';

const tcgProductSchema = z.object({
  price: z.number().min(0.01, 'Price must be greater than 0'),
  desc: z.string().optional()
});

type TCGProductFormData = z.infer<typeof tcgProductSchema>;

interface TCGProductFormProps {
  onSubmit: (data: { name: string; image_url: string; price: number; description: string; category: string }) => void;
  onCancel: () => void;
}

const TCGProductForm: React.FC<TCGProductFormProps> = ({ onSubmit, onCancel }) => {
  const [selectedCategory, setSelectedCategory] = useState(tcgApiCategories[0]);
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
    resolver: zodResolver(tcgProductSchema)
  });

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // If selected category doesn't provide an endpoint (coming soon), skip search
    if (!selectedCategory || !selectedCategory.endpoint) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      const finalEndpoint = `${selectedCategory.endpoint}?${searchById ? 'id' : 'name'}=${encodeURIComponent(searchQuery)}`;

      try {
        const response = await fetch(finalEndpoint, {
          headers: {
            'x-api-key': '79ad473ec4732427d64f7090dce2ced8e387d84850af8ba6c2544c4d369414c1'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('TCG API Search Data:', data);

          setSearchResults(data.data.map((card: any) => ({
            id: card.id || card.uuid || card._id || `${card.name}-${Math.random()}`,
            name: card.name,
            image: card.image || card.images?.[0] || card.imageUrl || card.images?.small || '',
          })));
        } else {
          toast.error('Failed to search cards');
        }
      } catch (error) {
        toast.error('Error searching cards. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, searchById]);

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
        category: selectedCategory.name
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
        {/* TCG Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TCG Category
          </label>
          <select
            value={selectedCategory.name}
            onChange={(e) => {
              const category = tcgApiCategories.find(cat => cat.name === e.target.value);
              if (category) {
                setSelectedCategory(category);
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
          {selectedCategory && !selectedCategory.endpoint && (
            <p className="text-amber-600 text-sm mt-1.5 bg-amber-50 p-2 rounded">
              This category is coming soon and cannot be searched yet.
            </p>
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
              disabled={!selectedCategory || !selectedCategory.endpoint}
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
              onChange={() => {
                setSearchById(p => !p);
              }}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <label className="text-sm text-gray-700">Search by ID</label>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-3 max-h-64 overflow-y-auto border border-gray-300 rounded-lg">
              {searchResults.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedCard(card)}
                  className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selectedCard?.id === card.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {card.image && (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{card.name}</p>
                      {card.description && (
                        <p className="text-sm text-gray-600 mt-0.5 truncate">{card.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Card Preview */}
        {selectedCard && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected Card:</p>
            <div className="flex items-center gap-3">
              {selectedCard.image && (
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">{selectedCard.name}</p>
                {selectedCard.description && (
                  <p className="text-sm text-gray-600 mt-0.5">{selectedCard.description}</p>
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            placeholder="Add extra details about this product..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-white py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TCGProductForm;