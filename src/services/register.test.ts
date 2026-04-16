import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { UserAlreadyExistsError } from './errors/user-already-exists.error.js'
import { RegisterService } from './register.js'
import 'node:crypto'
import { randomUUID } from 'node:crypto'

let inMemoryRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register service tests', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository()
    sut = new RegisterService(inMemoryRepository)
  })

  it('should be able to register', async () => {
    const email = `${randomUUID()}@${randomUUID()}.com`

    const { user } = await sut.execute({
      name: 'Dana Zane',
      email,
      password: 'r3dc@met',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toBe(email)
  })

  it('should encrypt user password on registration', async () => {
    const { user } = await sut.execute({
      name: 'Dana Zane',
      email: `${randomUUID()}@${randomUUID()}.com`,
      password: 'r3dc@met',
    })

    const isPasswordHashed = await compare('r3dc@met', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should should not register if email is already in use', async () => {
    const email = `${randomUUID()}@${randomUUID()}.com`

    await sut.execute({
      name: 'Dana Zane',
      email,
      password: '123456',
    })

    await expect(
      sut.execute({
        name: 'Dana Zane',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
