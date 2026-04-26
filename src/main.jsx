import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom'
import './index.css'
import AboutPage from './pages/AboutPage.jsx'
import PokedexPage from './pages/PokedexPage.jsx'
import PokemonDetailPage from './pages/PokemonDetailPage.jsx'

function Layout() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">Pokedex</Link>
        <Link to="/about">About</Link>
      </nav>
      <Outlet />
    </div>
  )
}

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <PokedexPage /> },
      { path: 'pokemon/:name', element: <PokemonDetailPage /> },
      { path: 'about', element: <AboutPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
