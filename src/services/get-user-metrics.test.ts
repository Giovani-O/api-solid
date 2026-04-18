import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInHistoryService } from './fetch-user-check-in-history.js'
import { GetUserMetricsService } from './get-user-metrics.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

const testCheckIn = {
  gym_id: 'gym-01',
  user_id: 'user-01',
  userLatitude: -23.5614,
  userLongitude: -46.6561,
}

describe('Get user metrics service tests', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(inMemoryCheckInsRepository) // System under test
  })

  it('should be able to get check ins count from user metrics', async () => {
    for (let i = 1; i <= 5; i++) {
      await inMemoryCheckInsRepository.create({
        ...testCheckIn,
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const metrics = await sut.execute({ userId: 'user-01' })

    expect(metrics.checkInsCount).toEqual(5)
  })

  it('should return 0 if there is no check ins', async () => {
    const metrics = await sut.execute({ userId: 'user-01' })

    expect(metrics.checkInsCount).toEqual(0)
  })
})
