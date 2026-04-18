import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/client'
import type { Gym } from '../../../generated/prisma/client.js'
import type { GymCreateInput } from '../../../generated/prisma/models.js'
import type { GymsRepository } from '../gyms-repository.js'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) return null

    return gym
  }

  async searchMany(query: string, page: number) {
    const gym = this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gym
  }

  async create(data: GymCreateInput) {
    const gym = {
      id: data.id ? data.id : randomUUID(),
      title: data.title,
      description: data.description ?? '',
      phone: data.phone ?? '',
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      createdAt: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
