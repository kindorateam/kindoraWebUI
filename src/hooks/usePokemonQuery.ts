import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

import { pokemonService } from '@/services'

export const usePokemonQuery = (nameOrId: string) => {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => pokemonService.getPokemon(nameOrId),
    enabled: !!nameOrId,
  })
}

export const usePokemonListQuery = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemon-list', limit],
    queryFn: ({ pageParam = 0 }) =>
      pokemonService.getPokemonList(limit, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return nextOffset < lastPage.count ? nextOffset : undefined
    },
  })
}

export const usePokemonSimpleListQuery = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['pokemon-simple-list', limit, offset],
    queryFn: () => pokemonService.getPokemonList(limit, offset),
  })
}
