import { Link } from 'react-router-dom'
import clubs from '../data/clubs.json'

export default function ClubsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Klubbar</h1>
      <ul className="space-y-3">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link
              to={`/clubs/${club.slug}`}
              className="block bg-white shadow rounded-lg px-5 py-4 hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-800">{club.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
