'use client';

import type { Product } from '@/lib/tipos';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/componentes/ui/grafico';

type BestsellersChartProps = {
  products: Product[];
};

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function BestsellersChart({ products }: BestsellersChartProps) {
  const top5Products = products
    .map((p) => ({
      ...p,
      slug: p.name.replace(/\s+/g, '-').toLowerCase(),
      totalSales: p.historicalSales.reduce((acc, s) => acc + s.sales, 0),
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  const allMonths = [
    ...new Set(products.flatMap((p) => p.historicalSales.map((s) => s.month))),
  ];

  const chartData = allMonths.map((month) => {
    const monthData: { [key: string]: string | number } = { month };
    top5Products.forEach((product) => {
      const saleForMonth = product.historicalSales.find(
        (s) => s.month === month
      );
      monthData[product.slug] = saleForMonth ? saleForMonth.sales : 0;
    });
    return monthData;
  });

  const chartConfig = top5Products.reduce((acc, product, index) => {
    acc[product.slug] = {
      label: product.name,
      color: chartColors[index % chartColors.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-80">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          right: 10,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {top5Products.map((product) => (
          <Line
            key={product.id}
            dataKey={product.slug}
            type="monotone"
            stroke={`var(--color-${product.slug})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
