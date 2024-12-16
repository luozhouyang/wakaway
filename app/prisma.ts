import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

// Declare a global variable to hold the Prisma client
declare global {
  var prisma: PrismaClient | undefined
}

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

// Singleton pattern for Prisma client
export function getPrismaClient(env: { DB: D1Database }) {
  // In development, create a new client each time
  if (process.env.NODE_ENV === 'development') {
    return createPrismaClient(env)
  }

  // In production, use a global singleton
  //   if (!global.prisma) {
  //     global.prisma = createPrismaClient(env)
  //   }

  //   return global.prisma
  return createPrismaClient(env);
}
