import React from 'react';
import { categories } from '../data/categories';
import styled from 'styled-components';

// Styled Components
const FiltersContainer = styled.div`
  padding: 1rem;
  background-color: #2D2D2D;
  border-radius: 0.5rem;
  font-family: 'Sora', sans-serif;
`;

const FiltersTitle = styled.h3`
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FilterButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: ${props => props.$isActive ? '#a71fd0' : 'transparent'};
  color: ${props => props.$isActive ? '#ffffff' : '#D2D2D2'};

  &:hover {
    background-color: ${props => props.$isActive ? '#7f00a5' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

// Component
interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <FiltersContainer>
      <FiltersTitle>Filter by Category</FiltersTitle>
      
      <FilterButton
        $isActive={selectedCategory === ''}
        onClick={() => onCategoryChange('')}
      >
        All Categories
      </FilterButton>

      {categories.map((category) => (
        <FilterButton
          key={category}
          $isActive={selectedCategory === category}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </FilterButton>
      ))}
    </FiltersContainer>
  );
};

export default ProductFilters;
