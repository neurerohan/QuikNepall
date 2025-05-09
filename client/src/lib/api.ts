import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCalendar = async (year: string, month: string) => {
  try {
    console.log(`Fetching calendar for year=${year}, month=${month}`);
    
    // Use the updated endpoint with proper path
    const response = await api.get(`/calendar/${year}/${month}`);
    console.log("Calendar API response status:", response.status);
    
    // Log the first few properties to debug
    if (response.data) {
      console.log("Calendar response contains data:", Object.keys(response.data));
      if (response.data.days) {
        console.log(`Calendar has ${response.data.days.length} days`);
        // Log first day to show structure
        if (response.data.days.length > 0) {
          console.log("First day sample:", JSON.stringify(response.data.days[0]).substring(0, 200) + "...");
        }
      } else {
        console.error("No days data in response");
      }
    }
    
    if (response.data && response.data.days) {
      let calendarData = response.data.days;
      
      // Sort data by day number to ensure days are in correct order
      calendarData = calendarData.sort((a: any, b: any) => {
        return parseInt(a.bs_day_english_equivalent) - parseInt(b.bs_day_english_equivalent);
      });
      
      // Format the data to match component expectations
      return {
        days: calendarData.map((day: any) => {
          // Check if the day has events
          const events = day.events_raw?.length ? day.events_raw : [];
          
          // Get the Nepali day from the bs_day_nepali (which is in Devanagari script)
          // or fallback to bs_day_english_equivalent as integer
          let nepaliDay = day.bs_day_nepali; // This is in Devanagari script like "१", "२", etc.
          let nepaliDayNumeric = parseInt(day.bs_day_english_equivalent); // This is 1, 2, etc.
          
          return {
            bs: {
              year: day.bs_year,
              month: day.bs_month_number,
              day: nepaliDayNumeric,
              nepaliDay: nepaliDay // Keep the Devanagari representation
            },
            ad: {
              year: day.ad_year,
              month: getMonthNumberFromName(day.ad_month_name),
              day: day.ad_day,
              monthName: day.ad_month_name
            },
            isHoliday: events.length > 0 || day.day_of_week === 'Saturday',
            events: events,
            dayOfWeek: getDayOfWeekNumber(day.day_of_week),
            tithi: day.tithi
          };
        }),
        monthDetails: {
          bs: {
            monthName: response.data.month_name,
            year: parseInt(year),
            month: parseInt(month)
          },
          ad: {
            monthName: calendarData[0]?.ad_month_name || 'Unknown',
            year: calendarData[0]?.ad_year || new Date().getFullYear(),
            month: getMonthNumberFromName(calendarData[0]?.ad_month_name) || new Date().getMonth() + 1
          },
          meta: {
            nepaliHeader: calendarData[0]?.meta_header_nepali,
            englishHeader: calendarData[0]?.meta_header_english,
            source: calendarData[0]?.source_url
          }
        }
      };
    } else {
      console.error("Invalid API response format:", response.data);
      throw new Error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error in calendar data generation:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

// Function to get calendar events
export const getCalendarEvents = async (params: { year_bs?: string, start_date_bs?: string, end_date_bs?: string }) => {
  try {
    const response = await api.get('/calendar-events', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error("Failed to fetch calendar events");
  }
};

// Helper function to get month number from name
function getMonthNumberFromName(monthName: string): number {
  const months = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12
  };
  return months[monthName as keyof typeof months] || 1;
}

// Helper function to get day of week number
function getDayOfWeekNumber(dayName: string): number {
  const days = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  return days[dayName as keyof typeof days] || 0;
};

// Helper function to get Nepali month name
export function getMonthName(month: number): string {
  const nepaliMonths = [
    'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  return nepaliMonths[month - 1] || '';
}

export const convertDate = async (params: { from: string; date: string }) => {
  const response = await api.get(`/calendar-convert`, { params });
  return response.data;
};

export const getVegetables = async () => {
  const response = await api.get('/vegetables');
  // Extract results from the response
  return response.data.results || [];
};

export const getMetals = async () => {
  try {
    const response = await api.get('/metals');
    // Transform the metals data to the format our components expect
    if (response.data && response.data.results) {
      const metals = response.data.results;
      const goldItems = metals.filter((item: any) => item.metal === 'gold');
      const silverItems = metals.filter((item: any) => item.metal === 'silver');
      
      return {
        gold: {
          fineGold: goldItems.find((item: any) => item.metal_type === 'fine' && item.unit === 'tola')?.price || '0',
          standardGold: goldItems.find((item: any) => item.metal_type === 'hallmark' && item.unit === 'tola')?.price || '0'
        },
        silver: {
          standardSilver: silverItems.find((item: any) => item.unit === 'tola')?.price || '0'
        },
        source: 'real_data'
      };
    }
    console.error("Unexpected API response format from metals API");
    throw new Error("Invalid API response format");
  } catch (error) {
    console.error("Error fetching metals data:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

export const getRashifal = async () => {
  try {
    // Get data from the API for rashifal
    const response = await api.get('/rashifal');
    
    if (response.data && response.data.rashifal) {
      // Use the format where data is in the 'rashifal' property
      const mappedPredictions = response.data.rashifal.map((item: any) => {
        // Extract English sign name from sign_nepali (e.g., "वृश्चिक Scorpio" -> "Scorpio")
        const englishSign = item.sign_nepali ? 
          item.sign_nepali.split(' ').pop() : 
          mapSignToEnglish(item.sign);
          
        return {
          sign: englishSign,
          prediction: item.prediction,
          date: item.date
        };
      });
      
      return {
        predictions: mappedPredictions,
        todayEvent: response.data.source || "Daily Rashifal",
        source: 'real_data'
      };
    }
    
    // If we don't have the expected format, throw an error
    console.error("Unexpected API response format from rashifal API");
    throw new Error("Invalid rashifal API response format");
  } catch (error) {
    console.error("Error fetching rashifal data:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

// Helper function to map Nepali sign names to English
function mapSignToEnglish(nepaliSign: string): string {
  const signMap: {[key: string]: string} = {
    'mesh': 'Aries',
    'brish': 'Taurus',
    'mithun': 'Gemini',
    'karkat': 'Cancer',
    'simha': 'Leo',
    'kanya': 'Virgo',
    'tula': 'Libra',
    'brischik': 'Scorpio',
    'dhanu': 'Sagittarius',
    'makar': 'Capricorn',
    'kumbha': 'Aquarius',
    'meen': 'Pisces'
  };
  
  return signMap[nepaliSign] || nepaliSign;
}

export const getTodayNepaliDate = async () => {
  try {
    const response = await api.get('/today');
    return response.data.today;
  } catch (error) {
    console.error("Error fetching today's Nepali date:", error);
    throw new Error("Failed to get today's Nepali date");
  }
};

export const getForex = async (params: { from?: string; to?: string; page?: number; per_page?: number }) => {
  try {
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
        currentPage: params.page || 1,
        source: 'real_data'
      };
    }
    
    // If the API fails or returns unexpected format, throw an error
    console.error("Unexpected API response format from forex API");
    throw new Error("Invalid forex API response format");
  } catch (error) {
    console.error("Error fetching forex data:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

export default api;
