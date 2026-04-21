import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/env.js'
import { PrismaClient } from '../../generated/prisma/client.js'

const connectionString = env.DATABASE_URL
export const schema =
  new URL(env.DATABASE_URL).searchParams.get('schema') || 'public'

const adapter = new PrismaPg({ connectionString }, { schema })
export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
