export type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  status: 'active' | 'disabled';
  imageUrl: string;
  imageHint: string;
  historicalSales: { month: string; sales: number }[];
};
