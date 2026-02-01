import { createClient } from '@supabase/supabase-js';
import type { Product } from '../types/product';

export const SUPABASE_URL = 'https://ihhevhrrvmofklorfxfc.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaGV2aHJydm1vZmtsb3JmeGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzIzMDQsImV4cCI6MjA4NDYwODMwNH0.2aBMqZ1zDgRbmOXQxtOZWYXfBfRQ6UYExJlJYWz8zj4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type NewProductInput = Omit<
  Product,
  'uuid' | 'is_hidden' | 'created_at' | 'stock_quantity'
> & {
  stock_quantity?: number;
  is_hidden?: boolean;
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_hidden', false);

    if (error) throw error;
    return data as Product[];
  },

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data as Product[];
  },

  async createProduct(product: NewProductInput): Promise<Product> {
    const payload: NewProductInput = {
      ...product,
      is_hidden: product.is_hidden ?? false,
      stock_quantity: product.stock_quantity ?? 1,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select();

    if (error) throw error;
    return data![0] as Product;
  },

  async updateProduct(
    uuid: string,
    updates: Partial<NewProductInput>
  ): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('uuid', uuid)
      .select();

    if (error) throw error;
    return data![0] as Product;
  },

  async deleteProduct(uuid: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('uuid', uuid);
    if (error) throw error;
  },
};

export const mockProducts: Product[] = [
  {
    uuid: '1',
    name: 'Charizard Card',
    image_url:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    description: 'Rare holographic Charizard trading card',
    price: 299.99,
    category: 'Trading Cards',
    is_hidden: false,
    stock_quantity: 3,
    created_at: '2023-10-01T12:00:00Z',
  },
];
