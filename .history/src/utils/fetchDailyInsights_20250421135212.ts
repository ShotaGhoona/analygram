import { PrismaClient } from '@prisma/client';
import getAccountInsights from './getAccountinsightByDay.mjs';
import getPostInsights from './getPostinsightByDay.mjs';

const prisma = new PrismaClient();

export async function fetchDailyAccountInsights() {
  try {
    console.log('Starting daily account insights fetch...');
    const companies = await prisma.company.findMany();
    
    for (const company of companies) {
      try {
        const insights = await getAccountInsights(company.instagramBusinessId);
        if (insights) {
          await prisma.accountInsight.create({
            data: {
              ...insights,
              companyId: company.id
            }
          });
          console.log(`Successfully fetched account insights for ${company.name}`);
        }
      } catch (error) {
        console.error(`Error fetching account insights for ${company.name}:`, error);
      }
    }
    console.log('Completed daily account insights fetch');
  } catch (error) {
    console.error('Error in fetchDailyAccountInsights:', error);
    throw error;
  }
}

export async function fetchDailyPostInsights() {
  try {
    console.log('Starting daily post insights fetch...');
    const companies = await prisma.company.findMany();
    
    for (const company of companies) {
      try {
        const insights = await getPostInsights(company.instagramBusinessId);
        if (insights && insights.length > 0) {
          for (const insight of insights) {
            await prisma.postInsight.create({
              data: {
                ...insight,
                companyId: company.id
              }
            });
          }
          console.log(`Successfully fetched post insights for ${company.name}`);
        }
      } catch (error) {
        console.error(`Error fetching post insights for ${company.name}:`, error);
      }
    }
    console.log('Completed daily post insights fetch');
  } catch (error) {
    console.error('Error in fetchDailyPostInsights:', error);
    throw error;
  }
} 