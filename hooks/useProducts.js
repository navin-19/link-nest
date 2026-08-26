'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';

/**
 * Hook for managing the current user's products.
 * Fetches, creates, updates, deletes, and reorders products.
 */
export function useProducts(userId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!userId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
      if (err) {
        // If the table is not found in schema cache yet, treat as empty list without crashing UI
        if (err.code === 'PGRST204' || err.code === 'PGRST200' || err.message?.includes('schema cache')) {
          console.warn('Products table pending schema cache reload. Returning empty list.');
          setProducts([]);
          setError(null);
        } else {
          console.error('Failed to fetch products:', {
            message: err?.message,
            code: err?.code,
            details: err?.details,
            hint: err?.hint,
            raw: err,
          });
          setError(err.message || 'Failed to fetch products.');
        }
      } else {
        setProducts(data || []);
      }
    } catch (e) {
      console.error('Product fetch exception:', {
        message: e?.message,
        stack: e?.stack,
        raw: e,
      });
      setError(e.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to add product');
    const { product } = await res.json();
    setProducts((prev) => [...prev, product]);
    return product;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update product');
    const { product } = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    return product;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete product');
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reorderProducts = useCallback(async (reordered) => {
    setProducts(reordered);
    await Promise.all(
      reordered.map((product, index) =>
        fetch(`/api/products/${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: index }),
        })
      )
    );
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
    refetch: fetchProducts,
  };
}
