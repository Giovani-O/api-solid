import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateService } from './authenticate.js'
import { InvalidCredentialError } from './errors/invalid-credentials.error.js'

let inMemoryRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate service tests', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(inMemoryRepository) // System under test
  })

  it('should be able authenticate', async () => {
    await inMemoryRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'teste@teste.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'wrong@email.com',
        password: '123456',
      }),
    ).rejects.instanceOf(InvalidCredentialError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await inMemoryRepository.create({
      name: 'John Doe',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
    })

    await expect(
      sut.execute({
        email: 'teste@teste.com',
        password: 'wrong password',
      }),
    ).rejects.instanceOf(InvalidCredentialError)
  })
})
