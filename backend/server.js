// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const { prisma } = require("./config/database");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const investmentRoutes = require("./routes/investments");
const dashboardRoutes = require("./routes/dashboard");
const webhookRoutes = require("./routes/webhooks");
const aiRouter = require("./routes/ai");
const notificationRoutes = require("./routes/notifications");
const geocodeRoutes = require("./routes/geocode");
const chatRoutes = require("./routes/chat");
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'https://agrimarket-khaa.vercel.app', // Production Vercel
  'http://localhost:3000', // Local frontend
  'http://localhost:5173', // Vite dev server
  process.env.FRONTEND_URL // From environment variable
].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.options("*", cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/ai", aiRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/chats", chatRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Marketplace API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

const server = http.createServer(app);

// Socket.io Configuration
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
  
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected (${socket.id}):`, reason);
  });
  
  socket.on("joinProject", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined room project_${projectId}`);
  });
  
  socket.on("joinUser", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined room user_${userId}`);
  });
});

app.locals.io = io;
module.exports.io = io;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected via Prisma");
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

startServer();  res.json({
    success: true,
    message: "AI Marketplace API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: process.env.FRONTEND_URL || "https://agrimarket-khaa.vercel.app/",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected (${socket.id}):`, reason);
  });
  socket.on("joinProject", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`Socket ${socket.id} joined room project_${projectId}`);
    socket.on("joinUser", (userId) => {
      socket.join(`user_${userId}`);
    });
  });
});

app.locals.io = io;
module.exports.io = io;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected via Prisma");
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

startServer();
