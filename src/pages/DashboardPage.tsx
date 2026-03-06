import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/product'
import productsData from '../data/products.json'
import ordersData from '../data/orders.json'
import interactionsData from '../data/interactions.json'
import salesStatsData from '../data/salesStats.json'

interface Order {
  id: string
  clubName: string
  clubId: string
  date: string
  amount: number
  status: string
  items: number
}

interface Interaction {
  id: string
  club: string
  type: string
  message: string
  date: string
  resolved: boolean
}

interface SalesStat {
  clubId: string
  clubName: string
  totalOrders: number
  totalRevenue: number
  avgOrderValue: number
}

const products = productsData as Product[]
const orders = ordersData as Order[]
const interactions = interactionsData as Interaction[]
const salesStats = salesStatsData as SalesStat[]

const STATUS_STYLE: Record<string, string> = {
  levererad: 'bg-green-900/40 text-green-400',
  skickad: 'bg-blue-900/40 text-blue-400',
  behandlas: 'bg-yellow-900/40 text-yellow-400',
  väntar: 'bg-[#1A1A1A] text-[#A0A0A0]',
}

const INTERACTION_TYPE_STYLE: Record<string, string> = {
  fråga: 'bg-blue-900/40 text-blue-400',
  ändring: 'bg-yellow-900/40 text-yellow-400',
  feedback: 'bg-purple-900/40 text-purple-400',
}

function stockByCategory(): { category: string; count: number; maxCount: number }[] {
  const counts: Record<string, number> = {}
  for (const p of products) {
    if (p.active) counts[p.category] = (counts[p.category] ?? 0) + 1
  }
  const maxCount = Math.max(...Object.values(counts), 1)
  return Object.entries(counts).map(([category, count]) => ({ category, count, maxCount }))
}

export default function DashboardPage() {
  const { user } = useAuth()
  const stockData = stockByCategory()
  const totalRevenue = salesStats.reduce((sum, s) => sum + s.totalRevenue, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">
        Välkommen, {user?.username}!
      </h1>
      <p className="text-[#A0A0A0] mb-8">
        Roll: <span className="font-medium text-white">{user?.role}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Box 1 — Recent orders */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-5">
          <h2 className="text-base font-semibold text-white mb-4">Senaste beställningar</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{order.clubName}</p>
                  <p className="text-xs text-[#555]">{order.id} · {order.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-[#A0A0A0]">{order.amount.toLocaleString('sv-SE')} kr</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      STATUS_STYLE[order.status] ?? 'bg-[#1A1A1A] text-[#A0A0A0]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2 — Customer interactions */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-5">
          <h2 className="text-base font-semibold text-white mb-4">Kundinteraktioner</h2>
          <div className="space-y-3">
            {interactions.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                    INTERACTION_TYPE_STYLE[item.type] ?? 'bg-[#1A1A1A] text-[#A0A0A0]'
                  }`}
                >
                  {item.type}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{item.message}</p>
                  <p className="text-xs text-[#555]">{item.club} · {item.date}</p>
                </div>
                <span className="shrink-0 mt-0.5">
                  {item.resolved ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <span className="text-yellow-400 text-xs">●</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 3 — Stock levels per category */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-5">
          <h2 className="text-base font-semibold text-white mb-4">Lagernivåer per kategori</h2>
          <div className="space-y-3">
            {stockData.map(({ category, count, maxCount }) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#A0A0A0]">{category}</span>
                  <span className="text-white font-medium">{count} {count === 1 ? 'produkt' : 'produkter'}</span>
                </div>
                <div className="h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4BC8D8] transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 4 — Customer sales stats */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-5">
          <h2 className="text-base font-semibold text-white mb-1">Kundstatistik</h2>
          <p className="text-xs text-[#555] mb-4">
            Total omsättning: <span className="text-[#4BC8D8] font-semibold">{totalRevenue.toLocaleString('sv-SE')} kr</span>
          </p>
          <div className="space-y-3">
            {salesStats.map((stat) => (
              <div key={stat.clubId} className="bg-[#111111] rounded-md px-4 py-3">
                <p className="text-sm font-medium text-white mb-2">{stat.clubName}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[#555] mb-0.5">Beställningar</p>
                    <p className="text-white font-semibold">{stat.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-[#555] mb-0.5">Omsättning</p>
                    <p className="text-white font-semibold">{stat.totalRevenue.toLocaleString('sv-SE')} kr</p>
                  </div>
                  <div>
                    <p className="text-[#555] mb-0.5">Snittorder</p>
                    <p className="text-white font-semibold">{stat.avgOrderValue.toLocaleString('sv-SE')} kr</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
