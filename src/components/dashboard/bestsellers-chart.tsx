'use client';

import type { Product } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type BestsellersChartProps = {
  products: Product[];
};

export function BestsellersChart({ products }: BestsellersChartProps) {
  const chartData = products.slice(0, 5).map(product => ({
    name: product.name,
    sales: product.historicalSales.reduce((acc, sale) => acc + sale.sales, 0),
  })).sort((a, b) => b.sales - a.sales);

  const chartConfig = {
    sales: {
      label: 'Unidades Vendidas',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-80">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? '...' : '')}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
