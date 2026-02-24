'use server';
import {
  explainSalesForecast,
  type SalesForecastExplanationInput,
} from '@/ai/flows/sales-forecast-explanation-flow';

export async function getForecastExplanation(
  data: SalesForecastExplanationInput
) {
  try {
    const explanation = await explainSalesForecast(data);
    return { success: true, explanation };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate forecast explanation.' };
  }
}
