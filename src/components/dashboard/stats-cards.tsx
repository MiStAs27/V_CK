import { products } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, AlertTriangle } from 'lucide-react';

export function StatsCards() {
  const totalRevenue = products
    .filter((p) => p.status === 'active')
    .reduce((sum, product) => {
      const totalSales = product.historicalSales.reduce((acc, sale) => acc + sale.sales, 0);
      return sum + totalSales * product.price;
    }, 0);

  const productsInStock = products.filter((p) => p.status === 'active').length;
  const lowStockItems = products.filter((p) => p.stock < 10).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalRevenue.toLocaleString('en-US', {-
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-xs text-muted-foreground">Based on all historical sales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsInStock}</div>
          <p className="text-xs text-muted-foreground">Total active products</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">Items with stock below 10 units</p>
        </CardContent>
      </Card>
    </div>
  );
}
