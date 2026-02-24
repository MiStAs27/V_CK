'use client';

import * as React from 'react';
import { products as initialProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { getColumns } from '@/components/products/columns';
import { DataTable } from '@/components/products/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { EditProductDialog } from '@/components/products/edit-product-dialog';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleEdit = React.useCallback((product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  }, []);

  const handleSave = (updatedProduct: Product) => {
    setProducts(currentProducts =>
      currentProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setIsEditDialogOpen(false);
  };

  const columns = React.useMemo(() => getColumns({ onEdit: handleEdit }), [handleEdit]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona tu inventario de productos.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>
      <DataTable columns={columns} data={products} />
      {editingProduct && (
        <EditProductDialog
          key={editingProduct.id}
          product={editingProduct}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
