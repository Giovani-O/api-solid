import fastify from 'fastify'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import { env } from './env.js'

export const app = fastify()

// Database Setup
const connectionString = env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

prisma.user.create({
  data: {
    email: 'teste@teste.com',
    name: 'John Doe',
  },
})
