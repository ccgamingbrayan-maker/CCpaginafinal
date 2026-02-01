import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categories } from '../data/categories';
import { toast } from 'react-toastify';
import { supabase } from '../utils/supabase';

// Schema actualizado para coincidir con Supabase
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().url('Must be a valid URL').optional(),
  stock_quantity: z.number().min(0, 'Stock must be 0 or greater').default(1),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ManualProductFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    stock_quantity: number;
  }) => void;
  onCancel: () => void;
}

const ManualProductForm: React.FC<ManualProductFormProps> = ({ onSubmit, onCancel }) => {
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock_quantity: 1,
    }
  });

  const imageUrl = watch('image_url');

  React.useEffect(() => {
    if (imageUrl && imageUrl.startsWith('http')) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  // Manejar selección de archivo
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be smaller than 5MB');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      // Limpiar URL manual si había una
      setValue('image_url', '');
    }
  };

  // Subir imagen a Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image: ' + uploadError.message);
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      let finalImageUrl = data.image_url || '';

      // Si hay archivo, subirlo primero
      if (imageFile) {
        setUploadingImage(true);
        finalImageUrl = await uploadImage(imageFile);
      }

      if (!finalImageUrl) {
        toast.error('Please provide an image URL or upload an image');
        return;
      }

      // Preparar datos con nombres correctos de columnas
      await onSubmit({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: finalImageUrl,
        stock_quantity: data.stock_quantity,
      });

      toast.success('Product added successfully!');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h3 className="text-lg font-semibold">Add Product Manually</h3>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price ($)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Stock Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Quantity
        </label>
        <input
          type="number"
          {...register('stock_quantity', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.stock_quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register('category')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Image Upload/URL */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Product Image
        </label>

        {/* File Upload */}
        <div>
          <label
            htmlFor="image-file-upload"
            className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
          >
            {imageFile ? '✓ Image Selected' : '📁 Upload Image'}
          </label>
          <input
            id="image-file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">Max 5MB • JPG, PNG, GIF</p>
        </div>

        {/* URL Input */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Or paste image URL:</p>
          <input
            type="url"
            {...register('image_url')}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={!!imageFile}
          />
          {errors.image_url && (
            <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>
          )}
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative w-48 h-48 border border-gray-300 rounded-md overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview('');
                setImageFile(null);
                setValue('image_url', '');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadingImage ? 'Uploading...' : isSubmitting ? 'Adding...' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || uploadingImage}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ManualProductForm;