import { Card, CardBody, Image, Chip } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'

import { type Pokemon } from '@/types'

interface PokemonCardProps {
  pokemon: Pokemon
  clickable?: boolean
}

export const PokemonCard = ({
  pokemon,
  clickable = false,
}: PokemonCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (clickable) {
      void navigate({
        to: '/pokemon/$pokemonId',
        params: { pokemonId: pokemon.id.toString() },
      })
    }
  }

  return (
    <Card className="py-4" isPressable={clickable} onPress={handleClick}>
      <CardBody className="overflow-visible py-2">
        <div className="flex flex-col items-center">
          <Image
            alt={pokemon.name}
            className="rounded-xl object-cover"
            src={pokemon.sprites.front_default}
            width={150}
            height={150}
          />
          <div className="mt-4 text-center">
            <h4 className="text-large font-bold capitalize">{pokemon.name}</h4>
            <p className="text-small text-default-500">#{pokemon.id}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {pokemon.types.map((type, index) => (
                <Chip key={index} size="sm" variant="flat">
                  {type.type.name}
                </Chip>
              ))}
            </div>
            <div className="text-small mt-2 flex gap-4">
              <span>Height: {pokemon.height / 10}m</span>
              <span>Weight: {pokemon.weight / 10}kg</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
