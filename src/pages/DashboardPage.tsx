import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Välkommen, {user?.username}!
      </h1>
      <p className="text-gray-600">
        Roll: <span className="font-medium">{user?.role}</span>
      </p>
    </div>
  )
}
