import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { SearchGymService } from '../search-gyms.js'

export function makeSearchGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new SearchGymService(gymsRepository)

  return service
}
