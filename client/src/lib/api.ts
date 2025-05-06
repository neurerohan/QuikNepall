import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCalendar = async (year: string, month: string) => {
  const response = await api.get(`/calendar/${year}/${month}`);
  
  // Add transformation for calendar data
  if (response.data && response.data.results) {
    const calendarData = response.data.results;
    
    // Format the data to match component expectations
    return {
      days: calendarData.map((day: any) => ({
        bs: {
          year: day.bs_year,
          month: day.bs_month,
          day: day.bs_day
        },
        ad: {
          year: parseInt(day.ad_date.split('-')[0]),
          month: parseInt(day.ad_date.split('-')[1]),
          day: parseInt(day.ad_date.split('-')[2]),
          monthName: new Date(day.ad_date).toLocaleString('default', { month: 'long' })
        },
        isHoliday: !!day.festival,
        events: day.festival ? [day.festival] : [],
        dayOfWeek: new Date(day.ad_date).getDay() // 0 = Sunday, 1 = Monday, etc.
      })),
      monthDetails: {
        bs: {
          monthName: getMonthName(parseInt(month)),
          year: parseInt(year),
          month: parseInt(month)
        },
        ad: {
          monthName: new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' }),
          year: new Date(`${year}-${month}-01`).getFullYear(),
          month: new Date(`${year}-${month}-01`).getMonth() + 1
        }
      }
    };
  }
  
  return { days: [], monthDetails: {} };
};

// Helper function to get Nepali month name
function getMonthName(month: number): string {
  const nepaliMonths = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  return nepaliMonths[month - 1] || '';
}

export const convertDate = async (params: { from: string; date: string }) => {
  const response = await api.get(`/calendar/convert`, { params });
  return response.data;
};

export const getVegetables = async () => {
  const response = await api.get('/vegetables');
  // Extract results from the response
  return response.data.results || [];
};

export const getMetals = async () => {
  const response = await api.get('/metals');
  // Transform the metals data to the format our components expect
  if (response.data && response.data.results) {
    const metals = response.data.results;
    const goldItems = metals.filter((item: any) => item.metal === 'gold');
    const silverItems = metals.filter((item: any) => item.metal === 'silver');
    
    return {
      gold: {
        fineGold: goldItems.find((item: any) => item.unit === 'tola')?.buy_rate || '0',
        standardGold: goldItems.find((item: any) => item.unit === 'tola')?.sell_rate || '0'
      },
      silver: {
        standardSilver: silverItems.find((item: any) => item.unit === 'tola')?.buy_rate || '0'
      }
    };
  }
  return { gold: {}, silver: {} };
};

export const getRashifal = async () => {
  const response = await api.get('/rashifal');
  if (response.data && response.data.results) {
    return {
      predictions: response.data.results.map((item: any) => ({
        sign: item.sign,
        prediction: item.prediction
      })),
      todayEvent: ""  // Default empty event
    };
  }
  return { predictions: [], todayEvent: "" };
};

export const getForex = async (params: { from?: string; to?: string; page?: number; per_page?: number }) => {
  const response = await api.get('/forex', { params });
  if (response.data && response.data.results) {
    return {
      rates: response.data.results.map((item: any) => ({
        date: item.date,
        currency: item.currency,
        unit: item.unit,
        buyingRate: parseFloat(item.buy),
        sellingRate: parseFloat(item.sell),
        middleRate: (parseFloat(item.buy) + parseFloat(item.sell)) / 2
      })),
      totalPages: Math.ceil((response.data.count || 0) / (params.per_page || 10)),
      currentPage: params.page || 1
    };
  }
  return { rates: [], totalPages: 0, currentPage: 1 };
};

export default api;
