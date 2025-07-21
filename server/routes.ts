import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, analyticsStorage } from "./storage";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";
dotenv.config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "243082";
const ADMIN_COOKIE = "admin_auth";
const ADMIN_COOKIE_VALUE = "authenticated";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // --- Analytics Endpoints ---
  app.post("/api/track/visit", (req, res) => {
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const date = new Date().toISOString().slice(0, 10);
    analyticsStorage.recordVisit(date, ip, userAgent);
    res.json({ success: true });
  });

  app.post("/api/track/project-click", (req, res) => {
    const { project, type } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    if (!project || !type) return res.status(400).json({ error: "Missing project or type" });
    analyticsStorage.recordProjectClick(date, project, type);
    res.json({ success: true });
  });

  app.post("/api/track/resume-download", (_req, res) => {
    const date = new Date().toISOString().slice(0, 10);
    analyticsStorage.recordResumeDownload(date);
    res.json({ success: true });
  });

  app.post("/api/track/game-play", (req, res) => {
    const { game } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    if (!game) return res.status(400).json({ error: "Missing game" });
    analyticsStorage.recordGamePlay(date, game);
    res.json({ success: true });
  });

  app.post("/api/track/contact", (_req, res) => {
    const date = new Date().toISOString().slice(0, 10);
    analyticsStorage.recordContactSubmission(date);
    res.json({ success: true });
  });

  app.post("/api/track/social-click", (req, res) => {
    const { platform, source } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    if (!platform) return res.status(400).json({ error: "Missing platform" });
    analyticsStorage.recordSocialClick(date, platform, source);
    res.json({ success: true });
  });

  // --- Admin Auth ---
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.cookie(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
        httpOnly: true,
        sameSite: "strict",
        secure: false, // set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", (_req, res) => {
    res.clearCookie(ADMIN_COOKIE, { httpOnly: true, sameSite: "strict", secure: false });
    res.json({ success: true });
  });

  function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
    if (req.cookies[ADMIN_COOKIE] === ADMIN_COOKIE_VALUE) {
      return next();
    }
    res.status(401).json({ error: "Unauthorized" });
  }

  // --- Admin Analytics Endpoints (protected) ---
  app.get("/api/admin/analytics/visits", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, COUNT(*) as count FROM visits GROUP BY date ORDER BY date DESC LIMIT 30`
    ).all();
    res.json(rows);
  });

  app.get("/api/admin/analytics/project-clicks", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, project, type, COUNT(*) as count FROM project_clicks GROUP BY date, project, type ORDER BY date DESC LIMIT 90`
    ).all();
    res.json(rows);
  });

  app.get("/api/admin/analytics/resume-downloads", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, COUNT(*) as count FROM resume_downloads GROUP BY date ORDER BY date DESC LIMIT 30`
    ).all();
    res.json(rows);
  });

  app.get("/api/admin/analytics/game-plays", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, game, COUNT(*) as count FROM game_plays GROUP BY date, game ORDER BY date DESC LIMIT 90`
    ).all();
    res.json(rows);
  });

  app.get("/api/admin/analytics/contact-submissions", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, COUNT(*) as count FROM contact_submissions GROUP BY date ORDER BY date DESC LIMIT 30`
    ).all();
    res.json(rows);
  });

  app.get("/api/admin/analytics/social-clicks", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, platform, COUNT(*) as count FROM social_clicks GROUP BY date, platform ORDER BY date DESC LIMIT 90`
    ).all();
    res.json(rows);
  });

  // --- Enhanced Admin Analytics Endpoints ---
  // Visits: daily, weekly, yearly, lifetime, with timestamp, IP, user agent
  app.get("/api/admin/analytics/visits/daily", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, COUNT(*) as count FROM visits GROUP BY date ORDER BY date DESC LIMIT 30`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/visits/weekly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y-%W', date) as week, COUNT(*) as count FROM visits GROUP BY week ORDER BY week DESC LIMIT 52`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/visits/yearly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y', date) as year, COUNT(*) as count FROM visits GROUP BY year ORDER BY year DESC LIMIT 10`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/visits/lifetime", requireAdminAuth, (_req, res) => {
    const row = analyticsStorage.db.prepare(
      `SELECT COUNT(*) as count FROM visits`
    ).get();
    res.json(row);
  });
  app.get("/api/admin/analytics/visits/raw", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT id, date, ip, user_agent FROM visits ORDER BY id DESC LIMIT 1000`
    ).all();
    res.json(rows);
  });

  // Device/Location stats (basic: user agent, IP)
  app.get("/api/admin/analytics/visits/devices", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT user_agent, COUNT(*) as count FROM visits GROUP BY user_agent ORDER BY count DESC LIMIT 20`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/visits/ips", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT ip, COUNT(*) as count FROM visits GROUP BY ip ORDER BY count DESC LIMIT 20`
    ).all();
    res.json(rows);
  });

  // --- Enhanced Project Clicks Analytics ---
  app.get("/api/admin/analytics/project-clicks/daily", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, project, type, COUNT(*) as count FROM project_clicks GROUP BY date, project, type ORDER BY date DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/project-clicks/weekly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y-%W', date) as week, project, type, COUNT(*) as count FROM project_clicks GROUP BY week, project, type ORDER BY week DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/project-clicks/yearly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y', date) as year, project, type, COUNT(*) as count FROM project_clicks GROUP BY year, project, type ORDER BY year DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/project-clicks/lifetime", requireAdminAuth, (_req, res) => {
    const row = analyticsStorage.db.prepare(
      `SELECT COUNT(*) as count FROM project_clicks`
    ).get();
    res.json(row);
  });
  app.get("/api/admin/analytics/project-clicks/raw", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT id, date, project, type FROM project_clicks ORDER BY id DESC LIMIT 1000`
    ).all();
    res.json(rows);
  });

  // --- Enhanced Game Plays Analytics ---
  app.get("/api/admin/analytics/game-plays/daily", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, game, COUNT(*) as count FROM game_plays GROUP BY date, game ORDER BY date DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/game-plays/weekly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y-%W', date) as week, game, COUNT(*) as count FROM game_plays GROUP BY week, game ORDER BY week DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/game-plays/yearly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y', date) as year, game, COUNT(*) as count FROM game_plays GROUP BY year, game ORDER BY year DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/game-plays/lifetime", requireAdminAuth, (_req, res) => {
    const row = analyticsStorage.db.prepare(
      `SELECT COUNT(*) as count FROM game_plays`
    ).get();
    res.json(row);
  });
  app.get("/api/admin/analytics/game-plays/raw", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT id, date, game FROM game_plays ORDER BY id DESC LIMIT 1000`
    ).all();
    res.json(rows);
  });

  // --- Enhanced Resume Downloads Analytics ---
  app.get("/api/admin/analytics/resume-downloads/daily", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, COUNT(*) as count FROM resume_downloads GROUP BY date ORDER BY date DESC LIMIT 30`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/resume-downloads/weekly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y-%W', date) as week, COUNT(*) as count FROM resume_downloads GROUP BY week ORDER BY week DESC LIMIT 52`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/resume-downloads/yearly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y', date) as year, COUNT(*) as count FROM resume_downloads GROUP BY year ORDER BY year DESC LIMIT 10`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/resume-downloads/lifetime", requireAdminAuth, (_req, res) => {
    const row = analyticsStorage.db.prepare(
      `SELECT COUNT(*) as count FROM resume_downloads`
    ).get();
    res.json(row);
  });
  app.get("/api/admin/analytics/resume-downloads/raw", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT id, date FROM resume_downloads ORDER BY id DESC LIMIT 1000`
    ).all();
    res.json(rows);
  });

  // --- Enhanced Contact Submissions Analytics ---
  app.get("/api/admin/analytics/contact-submissions/daily", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, COUNT(*) as count FROM contact_submissions GROUP BY date ORDER BY date DESC LIMIT 30`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/contact-submissions/weekly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y-%W', date) as week, COUNT(*) as count FROM contact_submissions GROUP BY week ORDER BY week DESC LIMIT 52`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/contact-submissions/yearly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y', date) as year, COUNT(*) as count FROM contact_submissions GROUP BY year ORDER BY year DESC LIMIT 10`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/contact-submissions/lifetime", requireAdminAuth, (_req, res) => {
    const row = analyticsStorage.db.prepare(
      `SELECT COUNT(*) as count FROM contact_submissions`
    ).get();
    res.json(row);
  });
  app.get("/api/admin/analytics/contact-submissions/raw", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT id, date FROM contact_submissions ORDER BY id DESC LIMIT 1000`
    ).all();
    res.json(rows);
  });

  // --- Enhanced Social Clicks Analytics ---
  app.get("/api/admin/analytics/social-clicks/daily", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT date, platform, source, COUNT(*) as count FROM social_clicks GROUP BY date, platform, source ORDER BY date DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/social-clicks/weekly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y-%W', date) as week, platform, source, COUNT(*) as count FROM social_clicks GROUP BY week, platform, source ORDER BY week DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/social-clicks/yearly", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT strftime('%Y', date) as year, platform, source, COUNT(*) as count FROM social_clicks GROUP BY year, platform, source ORDER BY year DESC LIMIT 90`
    ).all();
    res.json(rows);
  });
  app.get("/api/admin/analytics/social-clicks/lifetime", requireAdminAuth, (_req, res) => {
    const row = analyticsStorage.db.prepare(
      `SELECT COUNT(*) as count FROM social_clicks`
    ).get();
    res.json(row);
  });
  app.get("/api/admin/analytics/social-clicks/raw", requireAdminAuth, (_req, res) => {
    const rows = analyticsStorage.db.prepare(
      `SELECT id, date, platform, source FROM social_clicks ORDER BY id DESC LIMIT 1000`
    ).all();
    res.json(rows);
  });

  const httpServer = createServer(app);

  return httpServer;
}
