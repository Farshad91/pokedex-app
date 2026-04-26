import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

// Show 20 Pokemon per page
const PAGE_SIZE = 20

export default function PokedexPage() {
  // Get search params from URL
  const [searchParams, setSearchParams] = useSearchParams()
  // Store the list of Pokemon
  const [pokemonList, setPokemonList] = useState([])
  // Track current page offset for pagination
  const [offset, setOffset] = useState(() => {
    // Read page from URL if it exists, otherwise start at 0
    const page = searchParams.get('page')
    return page ? (parseInt(page) - 1) * PAGE_SIZE : 0
  })
  // Show loading message while fetching
  const [isLoading, setIsLoading] = useState(false)
  // Store error messages
  const [errorMessage, setErrorMessage] = useState('')
  // Check if there is a next page
  const [hasNextPage, setHasNextPage] = useState(false)

  // Fetch Pokemon data from API when offset changes
  useEffect(() => {
    async function loadPokemon() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        // Fetch from PokéAPI with limit and offset for pagination
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
        )

        if (!response.ok) {
          throw new Error('Could not load Pokemon list.')
        }

        const data = await response.json()
        setPokemonList(data.results)
        setHasNextPage(Boolean(data.next))
      } catch {
        setErrorMessage('Something went wrong while fetching Pokemon.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemon()
    // Update URL with current page number
    const currentPage = Math.floor(offset / PAGE_SIZE) + 1
    setSearchParams({ page: currentPage })
  }, [offset])

  const pageNumber = Math.floor(offset / PAGE_SIZE) + 1

  return (
    <main>
      <h1>Pokedex</h1>
      <p>Page {pageNumber}</p>

      {isLoading && <p>Loading Pokemon...</p>}
      {errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && (
        <ul>
          {pokemonList.map((pokemon) => (
            <li key={pokemon.name} className="pokemon-card">
              <Link to={`/pokemon/${pokemon.name}?page=${pageNumber}`}>{pokemon.name}</Link>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setOffset((current) => current - PAGE_SIZE)} disabled={offset === 0 || isLoading}>
          Previous
        </button>
        <button onClick={() => setOffset((current) => current + PAGE_SIZE)} disabled={!hasNextPage || isLoading}>
          Next
        </button>
      </div>
    </main>
  )
}
