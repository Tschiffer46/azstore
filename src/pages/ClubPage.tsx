import { useParams } from 'react-router-dom'
import clubs from '../data/clubs.json'

export default function ClubPage() {
  const { clubSlug } = useParams<{ clubSlug: string }>()
  const club = clubs.find((c) => c.slug === clubSlug)

  if (!club) {
    return <p className="text-[#A0A0A0]">Klubben hittades inte.</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">{club.name}</h1>
    </div>
  )
}
