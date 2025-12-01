import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, RequestHandler } from "express";
import session from "express-session";
import csrf from "csurf";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// CSRF Protection middleware (session-based)
export const csrfProtection = csrf({ 
  cookie: false, // Use session-based CSRF (not cookies)
});

export function setupAuth(app: Express, authRateLimiter?: RequestHandler) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev_secret_key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // CSRF protection via SameSite cookies (MVP-friendly)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // CSRF token endpoint (public, provides token for forms)
  app.get("/api/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[Auth] Attempting login for: ${username}`);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log(`[Auth] User not found: ${username}`);
          return done(null, false);
        }
        if (!user.password) {
          console.log(`[Auth] User has no password (OAuth only): ${username}`);
          return done(null, false);
        }
        if (!(await comparePasswords(password, user.password))) {
          console.log(`[Auth] Invalid password for: ${username}`);
          return done(null, false);
        }
        console.log(`[Auth] Login successful for: ${username}`);
        return done(null, user);
      } catch (error) {
        console.error(`[Auth] Error during login:`, error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  const registerMiddleware = authRateLimiter 
    ? [authRateLimiter, csrfProtection]
    : [csrfProtection];

  app.post("/api/register", ...registerMiddleware, async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  const loginMiddleware = authRateLimiter
    ? [authRateLimiter, csrfProtection, passport.authenticate("local")]
    : [csrfProtection, passport.authenticate("local")];

  app.post("/api/login", ...loginMiddleware, (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", csrfProtection, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((destroyErr) => {
        if (destroyErr) return next(destroyErr);
        res.clearCookie('connect.sid');
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }
  next();
}

export function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).send("Forbidden");
  }
  next();
}
