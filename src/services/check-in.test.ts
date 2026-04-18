import { Decimal } from '@prisma/client/runtime/library.js'
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
  userLatitude: -23.5614,
  userLongitude: -46.6561,
}

const testGym = {
  id: 'gym-01',
  title: 'Academia Teste',
  description: '',
  phone: '',
  latitude: -23.5614,
  longitude: -46.6561,
}

describe('Check In service tests', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(inMemoryCheckInsRepository, inMemoryGymsRepository) // System under test

    await inMemoryGymsRepository.create(testGym)

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

  it('should not be able to check in if far from gym', async () => {
    inMemoryGymsRepository.items.push({
      ...testGym,
      id: 'gym-02',
      latitude: Decimal(40.3687722),
      longitude: Decimal(49.8364514),
    })

    await expect(
      sut.execute({
        ...testCheckIn,
        gymId: 'gym-02',
        userLatitude: 40.373094,
        userLongitude: 49.8502173,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
