import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

export default function PokemonDetailPage() {
  const { name } = useParams()
  const [searchParams] = useSearchParams()
  const pageParam = searchParams.get('page') || '1'
  const [pokemon, setPokemon] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadPokemonDetail() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

        if (!response.ok) {
          throw new Error('Could not load Pokemon details.')
        }

        const data = await response.json()
        setPokemon(data)
      } catch {
        setErrorMessage('Something went wrong while fetching Pokemon details.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemonDetail()
  }, [name])

  return (
    <main>
      <p>
        <Link to={`/?page=${pageParam}`}>Back to Pokedex</Link>
      </p>

      {isLoading && <p>Loading Pokemon details...</p>}
      {errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && pokemon && (
        <section>
          <h1>{pokemon.name}</h1>

          {pokemon.sprites?.front_default && (
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width="150"
              height="150"
            />
          )}

          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>

          <h2>Types</h2>
          <ul>
            {pokemon.types.map((typeInfo) => (
              <li key={typeInfo.type.name}>{typeInfo.type.name}</li>
            ))}
          </ul>

          <h2>Abilities</h2>
          <ul>
            {pokemon.abilities.map((abilityInfo) => (
              <li key={abilityInfo.ability.name}>{abilityInfo.ability.name}</li>
            ))}
          </ul>

          <h2>Stats</h2>
          <ul>
            {pokemon.stats.map((statInfo) => (
              <li key={statInfo.stat.name}>
                {statInfo.stat.name}: {statInfo.base_stat}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
