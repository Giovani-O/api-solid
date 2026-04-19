import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { CheckInService } from '../check-in.js'

export function makeCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const service = new CheckInService(checkInsRepository, gymsRepository)

  return service
}
