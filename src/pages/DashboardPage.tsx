import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">
        Välkommen, {user?.username}!
      </h1>
      <p className="text-[#A0A0A0]">
        Roll: <span className="font-medium text-white">{user?.role}</span>
      </p>
    </div>
  )
}
