import { PrismaClient } from '@prisma/client';
import fetchAndSaveDailyAccountInsights from './getAccountinsightByDay.mjs';
import fetchAndSaveDailyPostInsights from './getPostinsightByDay.mjs';
import { AccountInsight } from '@/types/accountInsight';

export async function fetchDailyAccountInsights() {
  try {
    console.log('Starting daily account insights fetch...');
    await fetchAndSaveDailyAccountInsights();
    console.log('Completed daily account insights fetch');
  } catch (error) {
    console.error('Error in fetchDailyAccountInsights:', error);
    throw error;
  }
}

export async function fetchDailyPostInsights() {
  try {
    console.log('Starting daily post insights fetch...');
    await fetchAndSaveDailyPostInsights();
    console.log('Completed daily post insights fetch');
  } catch (error) {
    console.error('Error in fetchDailyPostInsights:', error);
    throw error;
  }
} 