import { users, type User, type InsertUser } from "@shared/schema";
import Database from "better-sqlite3";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();

// --- Analytics Storage ---
export class AnalyticsStorage {
  public db: Database.Database;

  constructor(dbPath = "analytics.db") {
    this.db = new Database(dbPath);
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT
      );
      CREATE TABLE IF NOT EXISTS project_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        project TEXT NOT NULL,
        type TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS resume_downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS game_plays (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        game TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS social_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        platform TEXT NOT NULL,
        source TEXT
      );
    `);
  }

  recordVisit(date: string, ip?: string, userAgent?: string) {
    this.db.prepare(
      `INSERT INTO visits (date, ip, user_agent) VALUES (?, ?, ?)`
    ).run(date, ip, userAgent);
  }

  recordProjectClick(date: string, project: string, type: string) {
    this.db.prepare(
      `INSERT INTO project_clicks (date, project, type) VALUES (?, ?, ?)`
    ).run(date, project, type);
  }

  recordResumeDownload(date: string) {
    this.db.prepare(
      `INSERT INTO resume_downloads (date) VALUES (?)`
    ).run(date);
  }

  recordGamePlay(date: string, game: string) {
    this.db.prepare(
      `INSERT INTO game_plays (date, game) VALUES (?, ?)`
    ).run(date, game);
  }

  recordContactSubmission(date: string) {
    this.db.prepare(
      `INSERT INTO contact_submissions (date) VALUES (?)`
    ).run(date);
  }

  recordSocialClick(date: string, platform: string, source?: string) {
    this.db.prepare(
      `INSERT INTO social_clicks (date, platform, source) VALUES (?, ?, ?)`
    ).run(date, platform, source);
  }

  // Add fetch methods as needed for analytics dashboard
}

export const analyticsStorage = new AnalyticsStorage();
