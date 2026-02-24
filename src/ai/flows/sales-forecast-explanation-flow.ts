'use server';
/**
 * @fileOverview A Genkit flow for generating natural language explanations of sales forecasts.
 *
 * - explainSalesForecast - A function that provides a natural language explanation of a sales forecast.
 * - SalesForecastExplanationInput - The input type for the explainSalesForecast function.
 * - SalesForecastExplanationOutput - The return type for the explainSalesForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesForecastExplanationInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  predictedDemand: z
    .number()
    .describe('The predicted demand for the product (e.g., units per month).'),
  timePeriod: z.string().describe('The time period for the forecast (e.g., "next month", "Q3 2024").'),
  contributingFactors: z
    .array(z.string())
    .describe('Key factors contributing to the forecast (e.g., "seasonal demand", "marketing campaign", "competitor actions").'),
  historicalSalesTrend: z
    .string()
    .describe('A summary of recent historical sales trends for the product (e.g., "steady increase", "recent decline", "stable").'),
});
export type SalesForecastExplanationInput = z.infer<
  typeof SalesForecastExplanationInputSchema
>;

const SalesForecastExplanationOutputSchema = z
  .string()
  .describe(
    'A clear, natural language explanation and summary of the predicted demand, highlighting key contributing factors and trends.'
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
  prompt: `As an expert sales analyst, provide a clear and concise natural language explanation and summary of the sales forecast for the following product. Highlight the predicted demand, the time period covered, and the key contributing factors and historical trends.

Product Name: {{{productName}}}
Predicted Demand: {{{predictedDemand}}}
Time Period: {{{timePeriod}}}
Contributing Factors: {{#each contributingFactors}}- {{{this}}}\n{{/each}}
Historical Sales Trend: {{{historicalSalesTrend}}}

Explanation and Summary:`,
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
