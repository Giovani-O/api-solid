import { Decimal } from '@prisma/client/runtime/client'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInService } from './check-in.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInService

const testCheckIn = {
  gymId: 'gym-01',
  userId: 'user-01',
  userLatitude: 0,
  userLongitude: 0,
}

describe('Check In service tests', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(inMemoryCheckInsRepository, inMemoryGymsRepository) // System under test

    inMemoryGymsRepository.items.push({
      id: 'gym-01',
      title: 'Academia Teste',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create check in', async () => {
    const { checkIn } = await sut.execute(testCheckIn)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be possible for a user to checkin twice on a day', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute(testCheckIn)

    await expect(sut.execute(testCheckIn)).rejects.toBeInstanceOf(Error)
  })

  it('should be possible for a user to check in on different dates', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

    await sut.execute(testCheckIn)

    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute(testCheckIn)

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
