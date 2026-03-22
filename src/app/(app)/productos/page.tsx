'use client';

import * as React from 'react';
import { products as initialProducts } from '@/lib/datos';
import type { Product } from '@/lib/tipos';
import { getColumns } from '@/componentes/productos/columnas';
import { DataTable } from '@/componentes/productos/tabla-datos';
import { Button } from '@/componentes/ui/boton';
import { PlusCircle } from 'lucide-react';
import { EditProductDialog } from '@/componentes/productos/dialogo-editar-producto';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleEdit = React.useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleSave = (productData: Product, isNew: boolean) => {
    if (isNew) {
      setProducts(currentProducts => [productData, ...currentProducts]);
    } else {
      setProducts(currentProducts =>
        currentProducts.map(p => (p.id === productData.id ? productData : p))
      );
    }
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
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>
      <DataTable columns={columns} data={products} />
      <EditProductDialog
        key={selectedProduct?.id ?? 'new'}
        product={selectedProduct}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  );
}
