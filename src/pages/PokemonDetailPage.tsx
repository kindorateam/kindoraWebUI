import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Button,
  Image,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'

import { pokemonService } from '@/services/pokemon.service'

export function PokemonDetailPage() {
  const { pokemonId } = useParams({ from: '/pokemon/$pokemonId' })

  const {
    data: pokemon,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => pokemonService.getPokemon(pokemonId),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading Pokemon...</div>
        </div>
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Pokemon not found</h1>
          <p className="mt-2 text-gray-600">
            The Pokemon you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button as={Link} to="/" color="primary" className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-4">
        <Button as={Link} to="/" variant="light" startContent="←">
          Back to Home
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-col items-center pb-0">
          <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
          <p className="text-lg text-gray-500">#{pokemon.id}</p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Pokemon Image */}
            <div className="flex flex-col items-center">
              <Image
                alt={pokemon.name}
                src={pokemon.sprites.front_default}
                width={250}
                height={250}
                className="rounded-xl"
              />
              <div className="mt-4 flex gap-2">
                {pokemon.sprites.back_default && (
                  <Image
                    alt={`${pokemon.name} back`}
                    src={pokemon.sprites.back_default}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                )}
                {pokemon.sprites.front_shiny && (
                  <Image
                    alt={`${pokemon.name} shiny`}
                    src={pokemon.sprites.front_shiny}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Pokemon Details */}
            <div className="space-y-4">
              {/* Types */}
              <div>
                <h3 className="mb-2 font-semibold">Types</h3>
                <div className="flex gap-2">
                  {pokemon.types.map((type, index) => (
                    <Chip key={index} size="lg" variant="flat" color="primary">
                      {type.type.name}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Height</h3>
                  <p className="text-2xl">{pokemon.height / 10}m</p>
                </div>
                <div>
                  <h3 className="font-semibold">Weight</h3>
                  <p className="text-2xl">{pokemon.weight / 10}kg</p>
                </div>
              </div>

              {/* Base Stats */}
              <div>
                <h3 className="mb-3 font-semibold">Base Stats</h3>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">
                          {stat.stat.name.replace('-', ' ')}
                        </span>
                        <span>{stat.base_stat}</span>
                      </div>
                      <Progress
                        value={stat.base_stat}
                        maxValue={255}
                        color="primary"
                        size="sm"
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="mb-2 font-semibold">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability, index) => (
                    <Chip key={index} variant="bordered" className="capitalize">
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && ' (Hidden)'}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
