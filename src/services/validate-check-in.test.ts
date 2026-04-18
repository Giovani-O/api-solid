import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.error.js'
import { ValidateCheckInService } from './validate-check-in.js'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error.js'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate check in service tests', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(inMemoryCheckInsRepository) // System under test

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
    const testCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'Gym 1',
      user_id: 'User 1',
    })

    const { checkIn } = await sut.execute({
      checkInId: testCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(inMemoryCheckInsRepository.items[0]?.validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate a inexistent check in', async () => {
    await expect(
      sut.execute({
        checkInId: 'i-dont-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate a check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 1, 1, 0, 0)) // 0h00

    const testCheckIn = await inMemoryCheckInsRepository.create({
      gym_id: 'Gym 1',
      user_id: 'User 1',
    })

    const t21minutes = 1000 * 60 * 21 // 21 minutes | 0h21
    vi.advanceTimersByTime(t21minutes)

    await expect(
      sut.execute({
        checkInId: testCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
