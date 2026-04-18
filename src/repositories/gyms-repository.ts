import type { Gym } from '../../generated/prisma/client.js'
import type { GymCreateInput } from '../../generated/prisma/models.js'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: GymCreateInput): Promise<Gym>
}
