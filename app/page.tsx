'use client';

import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';

import ProductList from './components/ProductCard';
import {
  Product,
  SortByOption,
  ProductsResponse,
  MinRatingOption,
} from './types';

export default function App() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortByOption>('Default');
  const [minRating, setMinRating] = useState<MinRatingOption>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

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

  const filteredProducts =
    minRating === 'All'
      ? products
      : products.filter((product) => product.rating >= Number(minRating));

  const sortedProducts = [...filteredProducts];

  if (sortBy === 'Price Low to High') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price High to Low') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'Rating') {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (sortedProducts.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setSelectedIndex((prev) => {
        const nextIndex = prev + 1;

        if (nextIndex >= sortedProducts.length) {
          return 0;
        }

        return nextIndex;
      });
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      setSelectedIndex((prev) => {
        const nextIndex = prev - 1;

        if (nextIndex < 0) {
          return sortedProducts.length - 1;
        }

        return nextIndex;
      });
    }

    if (e.key === 'Enter') {
      const selectedProduct = sortedProducts[selectedIndex];

      if (selectedProduct) {
        setShowModal(true);
        setSelectedItem(selectedProduct);
      }
    }
  };
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
        onKeyDown={handleKeyDown}
      />
      {debouncedQuery && <h2>Your are searching for: {debouncedQuery}</h2>}

      {!query && <p>Start typing to search products.</p>}

      {loading && <p>Loading products...</p>}

      {error && <p>Something went wrong. Please try again.</p>}

      {!loading && !error && debouncedQuery && products.length === 0 && (
        <p>No products found for &quot;{debouncedQuery}&quot;.</p>
      )}

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

      <label>
        Minimum rating:
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value as MinRatingOption)}
        >
          <option value="All">All</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
        </select>
      </label>

      {!loading && !error && products.length > 0 && (
        <ProductList
          products={sortedProducts}
          selectedIndex={selectedIndex}
          showModal={showModal}
          setShowModal={setShowModal}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}
