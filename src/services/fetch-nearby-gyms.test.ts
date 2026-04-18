import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsService } from './fetch-nearby-gyms.js'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

const testGym = {
  title: 'Academia 1',
  description: '',
  phone: '',
  latitude: -23.5614,
  longitude: -46.6561,
}

describe('Fetch nearby gyms service tests', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(inMemoryGymsRepository) // System under test
  })

  it('should be able to fetch nearby gyms', async () => {
    await inMemoryGymsRepository.create({
      ...testGym,
      title: 'Near Gym',
      latitude: 40.3712635,
      longitude: 49.8482961,
    })

    await inMemoryGymsRepository.create({
      ...testGym,
      title: 'Far Gym',
      latitude: 52.0681187,
      longitude: -1.0247116,
    })

    const { gyms } = await sut.execute({
      userLatitude: 40.3712635,
      userLongitude: 49.8482961,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })

  it('should return empty list if there is no gyms nearby', async () => {
    await inMemoryGymsRepository.create({
      ...testGym,
      title: 'Near Gym',
      latitude: 52.0681187,
      longitude: -1.0247116,
    })

    const { gyms } = await sut.execute({
      userLatitude: 40.3712635,
      userLongitude: 49.8482961,
    })

    expect(gyms).toHaveLength(0)
  })
})
