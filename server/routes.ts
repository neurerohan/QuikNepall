import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

// Base URL for the external API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kalimatirate.nyure.com.np/api/";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Calendar endpoints
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
      
      // Use the detailed-calendar endpoint with year_bs and month_bs parameters
      const response = await axios.get(`${API_BASE_URL}detailed-calendar/`, {
        params: {
          year_bs: year,
          month_bs: monthName
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching calendar:", error);
      res.status(500).json({ message: "Failed to fetch calendar data" });
    }
  });
  
  // Calendar events endpoint
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const { year_bs, start_date_bs, end_date_bs } = req.query;
      const params: any = {};
      
      if (year_bs) {
        params.year_bs = year_bs;
      }
      
      if (start_date_bs && end_date_bs) {
        params.start_date_bs = start_date_bs;
        params.end_date_bs = end_date_bs;
      }
      
      const response = await axios.get(`${API_BASE_URL}calendar/`, { params });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  // Date converter endpoint
  app.get("/api/calendar/convert", async (req, res) => {
    try {
      const { from, date } = req.query;
      const response = await axios.get(`${API_BASE_URL}calendar/convert`, { params: { from, date } });
      res.json(response.data);
    } catch (error) {
      console.error("Error converting date:", error);
      res.status(500).json({ message: "Failed to convert date" });
    }
  });

  // Vegetables endpoint
  app.get("/api/vegetables", async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}vegetables/`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching vegetables:", error);
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
      res.status(500).json({ message: "Failed to fetch forex data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
