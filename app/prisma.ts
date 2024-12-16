import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

// Function to create a new Prisma client
function createPrismaClient(env: { DB: D1Database }) {
  const adapter = new PrismaD1(env.DB)
  
  return new PrismaClient({
    adapter,
    // Optional log configuration
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error']
  })
}

// Function to create a new Prisma client in development mode
function createPrismaClientDev(env: { DB_DEV: D1Database }) {
  const adapter = new PrismaD1(env.DB_DEV)
  
  return new PrismaClient({
    adapter,
    // Optional log configuration
    log: ['query', 'error', 'warn']
  })
}

// Singleton pattern for Prisma client
export function getPrismaClient(env: { DB: D1Database, DB_DEV: D1Database }) {
  // In development, create a new client each time
  if (process.env.NODE_ENV === 'development') {
    return createPrismaClientDev(env)
  }
  // TODO: Implement a cache for production
  return createPrismaClient(env);
}
