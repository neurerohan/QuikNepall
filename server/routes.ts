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
      const response = await axios.get(`${API_BASE_URL}calendar/${year}/${month}`);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching calendar:", error);
      res.status(500).json({ message: "Failed to fetch calendar data" });
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
      const response = await axios.get(`${API_BASE_URL}rashifal/`);
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
