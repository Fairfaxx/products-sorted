'use client';

import Image from 'next/image';
import { ProductListProps, Product } from '../types';

const ProductList = ({
  products,
  selectedIndex = 0,
  showModal,
  setShowModal,
  selectedItem,
}: ProductListProps) => {
  return (
    <div>
      <ul>
        {products.map((product: Product, index) => (
          <li
            key={product.id}
            className={`border mb-2.5 p-1 flex flex-col items-center ${selectedIndex === index ? ' border-blue-500' : ''}`}
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
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow text-mist-900">
            <h2>{selectedItem.title}</h2>

            <Image
              width={120}
              height={120}
              src={selectedItem.images[0]}
              alt={selectedItem.title}
            />

            <p>Price: ${selectedItem.price}</p>
            <p>Rating: {selectedItem.rating}</p>
            <p>Return Policy: {selectedItem.returnPolicy}</p>

            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
