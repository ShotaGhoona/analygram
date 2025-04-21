import { fetchDailyAccountInsights, fetchDailyPostInsights } from '@/utils/fetchDailyInsights';

export async function GET() {
  try {
    console.log('Starting daily account insights fetch...');
    await fetchDailyAccountInsights();
    console.log('Completed daily account insights fetch');
  } catch (error) {
    console.error('Error in fetchDailyAccountInsights:', error);
    throw error;
  }

  try {
    console.log('Starting daily post insights fetch...');
    await fetchDailyPostInsights();
    console.log('Completed daily post insights fetch');
  } catch (error) {
    console.error('Error in fetchDailyPostInsights:', error);
    throw error;
  }
} 