import type { GymsRepository } from '@/repositories/gyms-repository.js'
import type { Gym } from '../../generated/prisma/client.js'

interface SearchGymServiceRequest {
  query: string
  page: number
}

interface SearchGymServiceResponse {
  gyms: Gym[]
}

export class SearchGymService {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymServiceRequest): Promise<SearchGymServiceResponse> {
    const gyms = await this.gymRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
