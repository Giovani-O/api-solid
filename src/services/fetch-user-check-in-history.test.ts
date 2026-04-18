import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInHistoryService } from './fetch-user-check-in-history.js'
import { check } from 'zod/mini'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInHistoryService

const testCheckIn = {
  gym_id: 'gym-01',
  user_id: 'user-01',
  userLatitude: -23.5614,
  userLongitude: -46.6561,
}

describe('Fetch user check in history service tests', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInHistoryService(inMemoryCheckInsRepository) // System under test
  })

  it('should be able to fetch user check in history', async () => {
    await inMemoryCheckInsRepository.create({
      ...testCheckIn,
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await inMemoryCheckInsRepository.create({
      ...testCheckIn,
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns[0]?.gym_id).toEqual('gym-01')
    expect(checkIns[1]?.gym_id).toEqual('gym-02')
  })

  it('should fetch check in history with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInsRepository.create({
        ...testCheckIn,
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'user-01', page: 2 })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })

  it('should return empty array when there are no check ins', async () => {
    const { checkIns } = await sut.execute({ userId: 'user-01', page: 1 })

    expect(checkIns).toHaveLength(0)
  })
})
