import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymService } from './search-gyms.js'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymService

const testGym = {
  title: 'Academia 1',
  description: '',
  phone: '',
  latitude: -23.5614,
  longitude: -46.6561,
}

describe('Search gyms service tests', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymService(inMemoryGymsRepository) // System under test
  })

  it('should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create(testGym)

    await inMemoryGymsRepository.create({ ...testGym, title: 'Academia 2' })

    const { gyms } = await sut.execute({ query: 'Academia 2', page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Academia 2' })])
  })

  it('should search gyms with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        ...testGym,
        title: `Academia ${i}`,
      })
    }

    const { gyms } = await sut.execute({ query: 'Academia', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia 21' }),
      expect.objectContaining({ title: 'Academia 22' }),
    ])
  })

  it('should return empty list the query does not match anything', async () => {
    const { gyms } = await sut.execute({ query: 'Academia', page: 1 })

    expect(gyms).toHaveLength(0)
  })
})
