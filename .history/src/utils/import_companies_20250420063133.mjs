const cleanedCompanies = companies.map(company => ({
  ...company,
  igId: company.igId.replace(/['"]/g, '') // Remove all quotes (both single and double)
}));

for (const company of cleanedCompanies) {
  // ... existing code ...
} 