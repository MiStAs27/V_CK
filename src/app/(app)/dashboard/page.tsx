import { StatsCards } from '@/components/dashboard/stats-cards';
import { BestsellersChart } from '@/components/dashboard/bestsellers-chart';
import { ForecastTool } from '@/components/dashboard/forecast-tool';
import { products } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bot } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido de nuevo! Aquí tienes un resumen rápido de tu inventario.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Más Vendidos</CardTitle>
            </div>
            <CardDescription>
              Rendimiento de ventas mensual de tus productos principales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BestsellersChart products={products} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Pronóstico de Ventas con IA</CardTitle>
             </div>
            <CardDescription>
              Genera una explicación del pronóstico de demanda para un producto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForecastTool products={products} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
