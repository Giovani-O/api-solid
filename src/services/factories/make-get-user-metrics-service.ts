import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { GetUserMetricsService } from '../get-user-metrics.js'

export function makeGetUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new GetUserMetricsService(checkInsRepository)

  return service
}
