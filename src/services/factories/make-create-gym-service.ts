import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { CreateGym } from '../create-gym.js'

export function makeCreateGymService() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new CreateGym(gymsRepository)

  return service
}
