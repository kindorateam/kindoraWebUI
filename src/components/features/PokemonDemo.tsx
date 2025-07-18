import { Button, Input, Spinner, Card, CardBody } from '@heroui/react'
import { useState } from 'react'

import { PokemonCard } from './PokemonCard'
import { usePokemonQuery, usePokemonSimpleListQuery } from '@/hooks'

export const PokemonDemo = () => {
  const [pokemonName, setPokemonName] = useState('')
  const [searchName, setSearchName] = useState('')

  const {
    data: pokemon,
    isLoading: isPokemonLoading,
    error: pokemonError,
  } = usePokemonQuery(searchName)
  const { data: pokemonList, isLoading: isListLoading } =
    usePokemonSimpleListQuery(10)

  const handleSearch = () => {
    if (pokemonName.trim()) {
      setSearchName(pokemonName.toLowerCase().trim())
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">TanStack Query Pokemon Demo</h2>

        <div className="mx-auto flex max-w-md gap-2">
          <Input
            placeholder="Enter Pokemon name or ID"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button color="primary" onPress={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      {isPokemonLoading && (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {pokemonError && (
        <Card className="mx-auto max-w-md">
          <CardBody>
            <p className="text-danger text-center">
              Failed to fetch Pokemon: {pokemonError.message}
            </p>
          </CardBody>
        </Card>
      )}

      {pokemon && (
        <div className="flex justify-center">
          <PokemonCard pokemon={pokemon} clickable />
        </div>
      )}

      <div>
        <h3 className="mb-4 text-xl font-semibold">Random Pokemon List</h3>
        {isListLoading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {pokemonList?.results.map((pokemon, index) => (
              <Card
                key={pokemon.name}
                isPressable
                onPress={() => setSearchName(pokemon.name)}
              >
                <CardBody className="p-4 text-center">
                  <p className="font-medium capitalize">{pokemon.name}</p>
                  <p className="text-small text-default-500">#{index + 1}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
