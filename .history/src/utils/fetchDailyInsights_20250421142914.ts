import fetchAndSaveDailyAccountInsights from './getAccountinsightByDay.mjs';
import fetchAndSaveDailyPostInsights from './getPostinsightByDay.mjs';

export async function fetchDailyAccountInsights() {
  try {
    console.log('Starting daily account insights fetch...');
    await fetchAndSaveDailyAccountInsights();
    console.log('Completed daily account insights fetch');
  } catch (error) {
    console.error('Error fetching daily account insights:', error);
    throw error;
  }
}

export async function fetchDailyPostInsights() {
  try {
    console.log('Starting daily post insights fetch...');
    await fetchAndSaveDailyPostInsights();
    console.log('Completed daily post insights fetch');
  } catch (error) {
    console.error('Error fetching daily post insights:', error);
    throw error;
  }
} 