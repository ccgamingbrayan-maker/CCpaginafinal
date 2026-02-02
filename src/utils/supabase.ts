import { createClient } from '@supabase/supabase-js';
import type { Product } from '../types/product';

export const SUPABASE_URL = 'https://bmgqbmiivsbmjzygrcqu.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZ3FibWlpdnNibWp6eWdyY3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMDEzOTIsImV4cCI6MjA4NTU3NzM5Mn0.kNBhLb_ypPvFJzk4vsMEGI4izubgSA0sVUCrnA8HrI4';

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

