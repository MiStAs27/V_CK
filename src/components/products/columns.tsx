'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowActions } from '@/components/products/data-table-row-actions';
import { Skeleton } from '@/components/ui/skeleton';

const FormattedPrice = ({ price }: { price: number }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Skeleton className="h-5 w-20" />;
  }

  const formatted = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);

  return <div className="font-medium">{formatted}</div>;
};

export const getColumns = ({
  onEdit,
}: {
  onEdit: (product: Product) => void;
}): ColumnDef<Product>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Producto',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={64}
            height={48}
            className="rounded-md object-cover"
            data-ai-hint={product.imageHint}
          />
          <div className="flex flex-col">
            <span className="font-medium">{product.name}</span>
            <span className="text-xs text-muted-foreground">
              {product.sku}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const translated = status === 'active' ? 'Activo' : 'Desactivado';
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {translated}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      const color = stock < 10 ? 'text-destructive' : 'text-foreground';
      return <div className={color}>{stock} unidades</div>;
    },
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return <FormattedPrice price={price} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} onEdit={onEdit} />,
  },
];
