import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInService } from './check-in.js'

let inMemoryRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('Check In service tests', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(inMemoryRepository) // System under test
  })

  it('should be able to create check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
