'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  returnPolicy: string;
  images: string[];
};

type ProductsResponse = {
  products: Product[];
};

export default function App() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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

  console.log(products);
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
      {!loading && !error && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              className="border mb-2.5 p-1 flex flex-col items-center"
            >
              <div className="p-1 flex flex-col items-center">
                <h2>{product.title}</h2>

                <Image
                  width={60}
                  height={60}
                  src={product.images[0]}
                  alt={product.title}
                />

                <p>Price: ${product.price}</p>
                <p>Rating: {product.rating}</p>
                <p>Return Policy: {product.returnPolicy}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
