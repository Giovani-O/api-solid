import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CreateGym } from './create-gym.js'

let inMemoryRepository: InMemoryGymsRepository
let sut: CreateGym

describe('CreateGym service tests', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryGymsRepository()
    sut = new CreateGym(inMemoryRepository)
  })

  it('should create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia',
      description: 'Academia',
      phone: '11999999999',
      latitude: -23.5614,
      longitude: -46.6561,
    })

    expect(gym.id).toEqual(expect.any(String))
    expect(gym.title).toBe('Academia')
  })
})
