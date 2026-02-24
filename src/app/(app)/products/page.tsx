import { products } from '@/lib/data';
import { columns } from '@/components/products/columns';
import { DataTable } from '@/components/products/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ProductsPage() {
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
    </div>
  );
}
