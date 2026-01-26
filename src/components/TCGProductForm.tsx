import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { tcgApiCategories } from '../data/categories';
import { TCGCard } from '../types/product';
import { toast } from 'react-toastify';

const tcgProductSchema = z.object({
  price: z.number().min(0.01, 'Price must be greater than 0'),
  desc: z.string().optional()
});

type TCGProductFormData = z.infer<typeof tcgProductSchema>;

interface TCGProductFormProps {
  onSubmit: (data: { name: string; image: string; price: number; desc: string; category: string }) => void;
  onCancel: () => void;
}

const TCGProductForm: React.FC<TCGProductFormProps> = ({ onSubmit, onCancel }) => {
  const [selectedCategory, setSelectedCategory] = useState(tcgApiCategories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TCGCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TCGCard | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
      try {
        const response = await fetch(selectedCategory.endpoint, {
          headers: {
            'x-api-key': '79ad473ec4732427d64f7090dce2ced8e387d84850af8ba6c2544c4d369414c1'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter results based on search query (case-insensitive)
          const filtered = (Array.isArray(data) ? data : [])
            .filter((card: any) => card.name?.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 10);
          
          setSearchResults(filtered.map((card: any) => ({
            id: card.id || card.uuid || card._id || `${card.name}-${Math.random()}`,
            name: card.name,
            image: card.image || card.images?.[0] || card.imageUrl || '',
            description: card.description || card.desc || ''
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
  }, [searchQuery, selectedCategory]);

  const handleFormSubmit = async (data: TCGProductFormData) => {
    if (!selectedCard) {
      toast.error('Please select a card first');
      return;
    }

    try {
      await onSubmit({
        name: selectedCard.name,
        image: selectedCard.image,
        price: data.price,
        desc: data.desc || selectedCard.description || '',
        category: selectedCategory.name
      });
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Add Product from TCG API</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="tcg-category" className="block text-sm font-medium text-gray-700 mb-1">
            TCG Category
          </label>
          <select
            id="tcg-category"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {tcgApiCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {selectedCategory && !selectedCategory.endpoint && (
            <p className="text-sm text-gray-500 mt-2">This category is coming soon and cannot be searched yet.</p>
          )}
        </div>

        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Cards
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type to search cards..."
              disabled={!selectedCategory || !selectedCategory.endpoint}
            />
          </div>
          {isSearching && (
            <p className="text-sm text-gray-500 mt-1">Searching...</p>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
            {searchResults.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  selectedCard?.id === card.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{card.name}</p>
                    {card.description && (
                      <p className="text-sm text-gray-600 truncate">{card.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedCard && (
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Selected Card:</h4>
            <div className="flex items-center space-x-3">
              <img
                src={selectedCard.image}
                alt={selectedCard.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{selectedCard.name}</p>
                <p className="text-sm text-gray-600">{selectedCard.description}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              id="price"
              {...register('price', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Description (Optional)
            </label>
            <textarea
              id="desc"
              rows={3}
              {...register('desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add any additional description..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedCard}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TCGProductForm;