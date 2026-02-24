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
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRevenue.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </div>
          <p className="text-xs text-muted-foreground">Basado en todas las ventas históricas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos en Stock</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsInStock}</div>
          <p className="text-xs text-muted-foreground">Total de productos activos</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Artículos con Poco Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">Artículos con stock inferior a 10 unidades</p>
        </CardContent>
      </Card>
    </div>
  );
}
