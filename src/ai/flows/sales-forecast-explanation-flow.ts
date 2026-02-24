'use server';
/**
 * @fileOverview Un flujo de Genkit para generar explicaciones en lenguaje natural de pronósticos de ventas.
 *
 * - explainSalesForecast - Una función que proporciona una explicación en lenguaje natural de un pronóstico de ventas.
 * - SalesForecastExplanationInput - El tipo de entrada para la función explainSalesForecast.
 * - SalesForecastExplanationOutput - El tipo de retorno para la función explainSalesForecast.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesForecastExplanationInputSchema = z.object({
  productName: z.string().describe('El nombre del producto.'),
  predictedDemand: z
    .number()
    .describe('La demanda prevista para el producto (por ejemplo, unidades por mes).'),
  timePeriod: z.string().describe('El período de tiempo para el pronóstico (por ejemplo, "próximo mes", "T3 2024").'),
  contributingFactors: z
    .array(z.string())
    .describe('Factores clave que contribuyen al pronóstico (por ejemplo, "demanda estacional", "campaña de marketing", "acciones de la competencia").'),
  historicalSalesTrend: z
    .string()
    .describe('Un resumen de las tendencias históricas recientes de ventas del producto (por ejemplo, "aumento constante", "disminución reciente", "estable").'),
});
export type SalesForecastExplanationInput = z.infer<
  typeof SalesForecastExplanationInputSchema
>;

const SalesForecastExplanationOutputSchema = z
  .string()
  .describe(
    'Una explicación y resumen claros en lenguaje natural de la demanda prevista, destacando los factores y tendencias clave que contribuyen.'
  );
export type SalesForecastExplanationOutput = z.infer<
  typeof SalesForecastExplanationOutputSchema
>;

export async function explainSalesForecast(
  input: SalesForecastExplanationInput
): Promise<SalesForecastExplanationOutput> {
  return salesForecastExplanationFlow(input);
}

const salesForecastExplanationPrompt = ai.definePrompt({
  name: 'salesForecastExplanationPrompt',
  input: {schema: SalesForecastExplanationInputSchema},
  output: {schema: SalesForecastExplanationOutputSchema},
  prompt: `Como analista de ventas experto, proporciona una explicación y un resumen claros y concisos en lenguaje natural del pronóstico de ventas para el siguiente producto. Destaca la demanda prevista, el período de tiempo cubierto y los factores clave que contribuyen y las tendencias históricas.

Nombre del Producto: {{{productName}}}
Demanda Prevista: {{{predictedDemand}}}
Período de Tiempo: {{{timePeriod}}}
Factores Contribuyentes: {{#each contributingFactors}}- {{{this}}}\n{{/each}}
Tendencia Histórica de Ventas: {{{historicalSalesTrend}}}

Explicación y Resumen:`,
});

const salesForecastExplanationFlow = ai.defineFlow(
  {
    name: 'salesForecastExplanationFlow',
    inputSchema: SalesForecastExplanationInputSchema,
    outputSchema: SalesForecastExplanationOutputSchema,
  },
  async input => {
    const {output} = await salesForecastExplanationPrompt(input);
    return output!;
  }
);
