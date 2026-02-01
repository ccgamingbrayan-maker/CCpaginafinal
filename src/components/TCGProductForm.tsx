import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { tcgApiCategories } from '../data/categories';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Schema
const tcgProductSchema = z.object({
  price: z.number().min(0.01, 'Price must be greater than 0'),
  desc: z.string().optional()
});

type TCGProductFormData = z.infer<typeof tcgProductSchema>;

// Styled Components
const FormContainer = styled.div`
  padding: 2rem;
  background-color: #2D2D2D;
  border-radius: 0.75rem;
  font-family: 'Sora', sans-serif;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: #0f0f0f;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a71fd0;
    box-shadow: 0 0 0 3px rgba(167, 31, 208, 0.1);
  }
`;

const WarningBox = styled.div`
  background-color: rgba(248, 129, 8, 0.1);
  border-left: 3px solid #F88108;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: #F88108;
  font-size: 0.875rem;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #D2D2D2;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: #0f0f0f;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a71fd0;
    box-shadow: 0 0 0 3px rgba(167, 31, 208, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchStatus = styled.div`
  color: #D2D2D2;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #D2D2D2;
  font-size: 0.875rem;
  cursor: pointer;

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: #a71fd0;
  }
`;

const ResultsContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: #0f0f0f;
`;

const ResultCard = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: ${props => props.$isSelected ? 'rgba(167, 31, 208, 0.1)' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  gap: 1rem;
  align-items: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ResultImage = styled.img`
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.25rem;
  flex-shrink: 0;
`;

const ResultInfo = styled.div`
  flex: 1;

  h4 {
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
  }

  p {
    color: #D2D2D2;
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.3;
  }
`;

const SelectedCardBox = styled.div`
  padding: 1rem;
  background-color: rgba(64, 196, 133, 0.1);
  border: 1px solid #40C485;
  border-radius: 0.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SelectedCardImage = styled.img`
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 0.5rem;
  flex-shrink: 0;
`;

const SelectedCardInfo = styled.div`
  flex: 1;

  h4 {
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #D2D2D2;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: #0f0f0f;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a71fd0;
    box-shadow: 0 0 0 3px rgba(167, 31, 208, 0.1);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: #0f0f0f;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  min-height: 80px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a71fd0;
    box-shadow: 0 0 0 3px rgba(167, 31, 208, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #FF4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  background-color: #a71fd0;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Sora', sans-serif;

  &:hover {
    background-color: #7f00a5;
  }

  &:disabled {
    background-color: #5C1D71;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background-color: transparent;
  color: #D2D2D2;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Sora', sans-serif;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: #a71fd0;
    color: #a71fd0;
  }
`;

// Component
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

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
          setSearchResults(data.data.map((card: any) => ({
            id: card.id || card.uuid || card._id || `${card.name}-${Math.random()}`,
            name: card.name,
            image: card.image || card.images?.[0] || card.imageUrl || card.images?.small || '',
            description: card.text || card.description || ''
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
    <FormContainer>
      <FormTitle>Add Product from TCG API</FormTitle>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup>
          <Label htmlFor="tcg-category">TCG Category</Label>
          <StyledSelect
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
          >
            {tcgApiCategories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </StyledSelect>

          {selectedCategory && !selectedCategory.endpoint && (
            <WarningBox>
              This category is coming soon and cannot be searched yet.
            </WarningBox>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="search-cards">Search Cards</Label>
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              id="search-cards"
              type="text"
              placeholder="Type to search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!selectedCategory || !selectedCategory.endpoint}
            />
          </SearchContainer>

          {isSearching && <SearchStatus>Searching...</SearchStatus>}

          <CheckboxContainer>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={searchById}
                onChange={() => setSearchById(p => !p)}
              />
              Search by ID
            </CheckboxLabel>
          </CheckboxContainer>
        </FormGroup>

        {searchResults.length > 0 && (
          <ResultsContainer>
            {searchResults.map((card) => (
              <ResultCard
                key={card.id}
                type="button"
                $isSelected={selectedCard?.id === card.id}
                onClick={() => setSelectedCard(card)}
              >
                {card.image && <ResultImage src={card.image} alt={card.name} />}
                <ResultInfo>
                  <h4>{card.name}</h4>
                  {card.description && <p>{card.description}</p>}
                </ResultInfo>
              </ResultCard>
            ))}
          </ResultsContainer>
        )}

        {selectedCard && (
          <SelectedCardBox>
            {selectedCard.image && (
              <SelectedCardImage src={selectedCard.image} alt={selectedCard.name} />
            )}
            <SelectedCardInfo>
              <h4>Selected Card: {selectedCard.name}</h4>
              {selectedCard.description && <p>{selectedCard.description}</p>}
            </SelectedCardInfo>
          </SelectedCardBox>
        )}

        <FormGroup>
          <Label htmlFor="price">Price ($)</Label>
          <StyledInput
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Additional Description (Optional)</Label>
          <StyledTextarea
            id="description"
            {...register('desc')}
          />
        </FormGroup>

        <ButtonGroup>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </SubmitButton>
          <CancelButton type="button" onClick={onCancel}>
            Cancel
          </CancelButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default TCGProductForm;
