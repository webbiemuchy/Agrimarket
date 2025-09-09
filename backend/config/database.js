// backend/config/database.js
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ai_marketplace'
    }
  }
});

const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection has been established successfully via Prisma.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

const shutdown = async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
};

module.exports = { prisma, testConnection, shutdown };