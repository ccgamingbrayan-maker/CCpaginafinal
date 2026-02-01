// src/components/ManualProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categories } from '../data/categories';
import { toast } from 'react-toastify';
import type { NewProductInput } from '../utils/supabase';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  desc: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Must be a valid URL'),
  stock_quantity: z.number().int().min(1, 'Stock must be at least 1'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ManualProductFormProps {
  onSubmit: (data: NewProductInput) => Promise<void> | void;
  onCancel: () => void;
}

const ManualProductForm: React.FC<ManualProductFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit, // ✅ Necesario para el form
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      desc: '',
      price: 0,
      category: '',
      image: '',
      stock_quantity: 1,
    },
  });

  const imageUrl = watch('image');

  useEffect(() => {
    if (imageUrl && imageUrl.startsWith('http')) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const onSubmitForm = async (data: ProductFormData) => {
    const payload: NewProductInput = {
      name: data.name,
      description: data.desc,
      price: data.price,
      image_url: data.image,
      category: data.category,
      stock_quantity: data.stock_quantity,
    };

    try {
      await onSubmit(payload);
      toast.success('Product added successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Add Product Manually
      </h3>

      {/* ✅ CAMBIO AQUÍ: handleSubmit(onSubmitForm) */}
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-5"
        noValidate
      >
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1.5">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="desc"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="desc"
            rows={3}
            {...register('desc')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            placeholder="Enter product description"
          />
          {errors.desc && (
            <p className="text-red-600 text-sm mt-1.5">
              {errors.desc.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
            <p className="text-red-600 text-sm mt-1.5">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label
            htmlFor="stock_quantity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Stock quantity
          </label>
          <input
            type="number"
            id="stock_quantity"
            {...register('stock_quantity', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="1"
          />
          {errors.stock_quantity && (
            <p className="text-red-600 text-sm mt-1.5">
              {errors.stock_quantity.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1.5">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image URL
          </label>
          <input
            type="url"
            id="image"
            {...register('image')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="text-red-600 text-sm mt-1.5">
              {errors.image.message}
            </p>
          )}

          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                onError={() => setImagePreview('')}
              />
            </div>
          )}
        </div>

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

export default ManualProductForm;
