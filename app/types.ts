export type ProductListProps = {
  products: Product[];
};

export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  returnPolicy: string;
  images: string[];
};

export type ProductsResponse = {
  products: Product[];
};

export type SortByOption =
  | 'Default'
  | 'Price Low to High'
  | 'Price High to Low'
  | 'Rating';