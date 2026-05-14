'use client';

import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';

import ProductList from './components/ProductCard';
import { Product, SortByOption, ProductsResponse } from './types';

export default function App() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortByOption>('Default');

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortByOption);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getProducts(query: string, signal: AbortSignal) {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.get<ProductsResponse>(
          `https://dummyjson.com/products/search?q=${query}`,
          { signal },
        );

        setProducts(response.data.products);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request cancelled');
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    if (debouncedQuery) {
      getProducts(debouncedQuery, signal);
    }

    return () => controller.abort();
  }, [debouncedQuery]);

  const sortedProducts = [...products];

  if (sortBy === 'Price Low to High') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price High to Low') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Rating') {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="w-100 flex flex-col items-center gap-4 p-4">
      <h1>Product Search</h1>

      <input
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);

          if (value.trim() === '') {
            setProducts([]);
            setError(false);
            setLoading(false);
          }
        }}
      />
      {debouncedQuery && <h2>Your are searching for: {debouncedQuery}</h2>}

      {!query && <p>Start typing to search products.</p>}

      {loading && <p>Loading products...</p>}

      {error && <p>Something went wrong. Please try again.</p>}

      {!loading && !error && debouncedQuery && products.length === 0 && (
        <p>No products found for &quot;{debouncedQuery}&quot;.</p>
      )}

      <>
        <label>
          Sort by:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="Default">Default</option>
            <option value="Price Low to High">Price Low to High</option>
            <option value="Price High to Low">Price High to Low</option>
            <option value="Rating">Rating</option>
          </select>
        </label>
        <hr />
      </>

      {!loading && !error && products.length > 0 && (
        <ProductList products={sortedProducts} />
      )}
    </div>
  );
}
