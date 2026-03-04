import { Link } from 'react-router-dom'
import clubs from '../data/clubs.json'

export default function ClubsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Klubbar</h1>
      <ul className="space-y-3">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link
              to={`/clubs/${club.slug}`}
              className="block bg-[#111111] border border-[#1A1A1A] rounded-lg px-5 py-4 hover:border-[#4BC8D8] transition-colors"
            >
              <span className="font-medium text-white">{club.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
