import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios, { AxiosError } from "axios";

// Base URL for the external API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kalimatirate.nyure.com.np/api/";

// Date conversion utilities for Nepali calendar
// This is an approximation - for precise conversion we use the API
const getCurrentNepaliDate = async () => {
  try {
    // Use the API to get current Nepali date by converting today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Call the conversion API
    const response = await axios.get(`${API_BASE_URL}calendar/convert`, {
      params: { from: 'ad', date: todayStr }
    });
    
    if (response.data && response.data.bs) {
      // Get the BS date parts
      const dateParts = response.data.bs.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);
        
        // Get month name
        const nepaliMonths = [
          'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
          'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
          'Poush', 'Magh', 'Falgun', 'Chaitra'
        ];
        
        return {
          year: year,
          month: month,
          day: day,
          month_name: nepaliMonths[month - 1] || 'Unknown',
          day_of_week: today.getDay(), // 0-6 (Sunday-Saturday)
          ad_date: todayStr,
          bs_date: response.data.bs
        };
      }
    }
    
    throw new Error("Invalid response format from conversion API");
  } catch (error) {
    console.error("Error getting current Nepali date:", error);
    // Fallback: use approximation if API fails
    const today = new Date();
    // Get month name
    const nepaliMonths = [
      'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
      'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
      'Poush', 'Magh', 'Falgun', 'Chaitra'
    ];
    const monthIndex = today.getMonth();
    const nepaliMonth = monthIndex + 1;
    
    return {
      year: today.getFullYear() + 57, // Rough approximation
      month: nepaliMonth,
      day: today.getDate(),
      month_name: nepaliMonths[monthIndex],
      day_of_week: today.getDay(),
      ad_date: today.toISOString().split('T')[0],
      bs_date: `${today.getFullYear() + 57}-${nepaliMonth}-${today.getDate()}`
    };
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Important: Order matters in Express routes! Specific routes must be registered first.
  
  // Today's Nepali date endpoint
  app.get("/api/today", async (req, res) => {
    try {
      const todayNepaliDate = await getCurrentNepaliDate();
      res.json({
        today: todayNepaliDate,
        success: true
      });
    } catch (error) {
      console.error("Error getting today's Nepali date:", error);
      res.status(500).json({ 
        message: "Failed to get today's Nepali date",
        success: false 
      });
    }
  });
  
  // Calendar events endpoint
  app.get("/api/calendar-events", async (req, res) => {
    try {
      const { year_bs, start_date_bs, end_date_bs } = req.query;
      const params: any = {};
      
      // According to API documentation, these are the expected parameters
      if (year_bs) {
        params.year_bs = year_bs;
      }
      
      if (start_date_bs && end_date_bs) {
        params.start_date_bs = start_date_bs;
        params.end_date_bs = end_date_bs;
      }
      
      console.log("Calendar events params:", params);
      const response = await axios.get(`${API_BASE_URL}calendar/`, { params });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  // Date converter endpoint
  app.get("/api/calendar-convert", async (req, res) => {
    try {
      const { from, date } = req.query;
      console.log(`Converting date with params: from=${from}, date=${date}`);
      const response = await axios.get(`${API_BASE_URL}calendar/convert`, { params: { from, date } });
      res.json(response.data);
    } catch (error) {
      console.error("Error converting date:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to convert date" });
    }
  });
  
  // Calendar events endpoint
  app.get("/api/calendar-events", async (req, res) => {
    try {
      const { year_bs, month_bs, start_date_bs, end_date_bs } = req.query;
      console.log("Calendar events params:", { year_bs, month_bs, start_date_bs, end_date_bs });
      
      // Construct params object based on what was provided
      const params: any = {};
      if (year_bs) params.year_bs = year_bs;
      if (month_bs) params.month_bs = month_bs;
      if (start_date_bs) params.start_date_bs = start_date_bs;
      if (end_date_bs) params.end_date_bs = end_date_bs;
      
      // Make the API request to calendar endpoint
      const response = await axios.get(`${API_BASE_URL}calendar/`, { params });
      
      // Return the data
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });
  
  // Calendar endpoints (must be after the more specific routes)
  app.get("/api/calendar/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      // Convert month number to Nepali month name
      const nepaliMonths = [
        'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 
        'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
        'Poush', 'Magh', 'Falgun', 'Chaitra'
      ];
      const monthName = nepaliMonths[parseInt(month) - 1] || 'Baishakh';
      
      console.log(`Fetching calendar for year=${year}, month_name=${monthName}`);
      
      // Use the detailed-calendar endpoint with URL string parameters instead of params object
      // This ensures axios doesn't modify the parameter names
      const url = `${API_BASE_URL}detailed-calendar/?year=${year}&month_name=${monthName}`;
      console.log(`Making direct API call to: ${url}`);
      const response = await axios.get(url);
      
      console.log("Calendar API response status:", response.status);
      
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching calendar:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch calendar data" });
    }
  });

  // Vegetables endpoint
  app.get("/api/vegetables", async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}vegetables/`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching vegetables:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch vegetable data" });
    }
  });

  // Metals endpoint
  app.get("/api/metals", async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}metals/`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching metals:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch metal prices" });
    }
  });

  // Rashifal endpoint
  app.get("/api/rashifal", async (req, res) => {
    try {
      const { date } = req.query;
      const params: any = {};
      
      // Add date parameter if provided
      if (date) {
        params.date = date;
      }
      
      const response = await axios.get(`${API_BASE_URL}rashifal/`, { params });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching rashifal:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch rashifal data" });
    }
  });

  // Forex endpoint
  app.get("/api/forex", async (req, res) => {
    try {
      const { from, to, page, per_page } = req.query;
      const response = await axios.get(`${API_BASE_URL}forex`, { 
        params: { from, to, page, per_page } 
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching forex:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      res.status(500).json({ message: "Failed to fetch forex data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
