import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found.error.js'
import { GetUserProfileService } from './get-user-profile.js'

let inMemoryRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('Get user profile service tests', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(inMemoryRepository) // System under test
  })

  it('should be able get user profile', async () => {
    const testUser = await inMemoryRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: testUser.id,
    })

    expect(user.id).toEqual(testUser.id)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.instanceOf(ResourceNotFoundError)
  })
})
