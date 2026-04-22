import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { FetchUserCheckInHistoryService } from '../fetch-user-check-in-history.js'

export function makeFetchUserCheckInHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new FetchUserCheckInHistoryService(checkInsRepository)

  return service
}
