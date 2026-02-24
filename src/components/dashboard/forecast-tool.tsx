'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getForecastExplanation } from '@/app/(app)/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ForecastToolProps = {
  products: Product[];
};

const FormSchema = z.object({
  productId: z.string().min(1, 'Por favor, selecciona un producto.'),
});

export function ForecastTool({ products }: ForecastToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setExplanation(null);

    const product = products.find((p) => p.id === data.productId);
    if (!product) return;

    // Mocking some data for the AI flow
    const predictedDemand = Math.floor(
      product.historicalSales.slice(-1)[0].sales * (1 + Math.random() * 0.2)
    );
    const historicalTrend =
      product.historicalSales.slice(-1)[0].sales >
      product.historicalSales.slice(-2)[0].sales
        ? 'aumento constante'
        : 'estable';

    const result = await getForecastExplanation({
      productName: product.name,
      predictedDemand,
      timePeriod: 'próximo mes',
      contributingFactors: ['demanda estacional', 'campaña de marketing reciente'],
      historicalSalesTrend: historicalTrend,
    });

    setIsLoading(false);
    if (result.success) {
      setExplanation(result.explanation);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Generando...' : 'Generar Explicación'}
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      )}

      {explanation && (
        <div className="mt-4 rounded-lg border bg-secondary/50 p-4 text-sm">
          <div className="flex items-start gap-3">
            <Bot className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
            <p className="flex-1">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
