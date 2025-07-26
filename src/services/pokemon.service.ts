import { apiClient } from './api.service'
import { Pokemon, PokemonListResponse } from '@/types'

export const pokemonService = {
  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    return apiClient.get<Pokemon>(`/pokemon/${nameOrId}`)
  },

  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    return apiClient.get<PokemonListResponse>('/pokemon', {
      params: { limit, offset },
    })
  },
}
