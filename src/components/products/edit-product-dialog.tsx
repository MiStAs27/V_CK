'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const ProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  imageUrl: z.string().url('Debe ser una URL válida.'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  stock: z.coerce.number().int('El stock debe ser un número entero.').min(0, 'El stock no puede ser negativo.'),
  status: z.enum(['active', 'disabled']),
});

type ProductFormData = z.infer<typeof ProductSchema>;

interface EditProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (productData: Product, isNew: boolean) => void;
}

export function EditProductDialog({
  product,
  isOpen,
  onOpenChange,
  onSave,
}: EditProductDialogProps) {
  const { toast } = useToast();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
  });

  const isNewProduct = !product;

  useEffect(() => {
    if (isOpen) {
      form.reset(
        product
          ? {
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              stock: product.stock,
              status: product.status,
            }
          : {
              name: '',
              imageUrl: `https://picsum.photos/seed/new-product/400/300`,
              price: 0,
              stock: 0,
              status: 'active',
            }
      );
    }
  }, [product, form, isOpen]);

  const onSubmit = (data: ProductFormData) => {
    if (!isOpen) return;
    
    const productData: Product = {
      id: product?.id || Date.now().toString(),
      sku: product?.sku || `SKU-${Date.now().toString().slice(-5)}`,
      category: product?.category || 'Uncategorized',
      imageHint: product?.imageHint || data.name.split(' ').slice(0, 2).join(' ').toLowerCase(),
      historicalSales: product?.historicalSales || [],
      ...data,
    };
    onSave(productData, isNewProduct);
    toast({
      title: isNewProduct ? 'Producto añadido' : 'Producto actualizado',
      description: `El producto "${productData.name}" ha sido ${isNewProduct ? 'añadido' : 'actualizado'}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNewProduct ? 'Añadir Producto' : 'Editar Producto'}</DialogTitle>
          <DialogDescription>
            {isNewProduct ? 'Añade un nuevo producto a tu inventario.' : 'Realiza cambios en el producto. Haz clic en guardar cuando hayas terminado.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Imagen</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidades (Stock)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Estado</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value === 'active' ? 'Activo' : 'Desactivado'}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 'active'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'active' : 'disabled')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
