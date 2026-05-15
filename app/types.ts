export type ProductListProps = {
  products: Product[];
  selectedIndex: number;
  showModal: boolean;
  selectedItem: Product | null;
  setShowModal: (value: boolean) => void;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  returnPolicy: string;
  images: string[];
  selectedItem: React.ReactNode;
};

export type ProductsResponse = {
  products: Product[];
};

export type SortByOption =
  | 'Default'
  | 'Price Low to High'
  | 'Price High to Low'
  | 'Rating';

export type MinRatingOption = 'All' | '3' | '4' | '4.5';