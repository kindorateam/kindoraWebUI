import { createFileRoute } from '@tanstack/react-router'

import { RouteErrorBoundary } from '@/components/error'
import { PokemonDetailPage } from '@/pages/PokemonDetailPage'

export const Route = createFileRoute('/pokemon/$pokemonId')({
  component: () => (
    <RouteErrorBoundary routeName="pokemon-detail">
      <PokemonDetailPage />
    </RouteErrorBoundary>
  ),
})