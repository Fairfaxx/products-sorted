'use client';

import React from 'react';
import Image from 'next/image';
import { ProductListProps, Product } from '../types';



const ProductList = ({ products }: ProductListProps) => {
  return (
    <div>
      <ul>
        {products.map((product: Product) => (
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
    </div>
  );
};

export default ProductList;
