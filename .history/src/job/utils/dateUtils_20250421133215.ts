export function getDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // 前日のデータを取得
  
    return { startDate, endDate };
  }