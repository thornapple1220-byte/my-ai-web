import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['전체', '헬스', '요가', '필라테스', '크로스핏', '수영', '기타']

export default function HomePage() {
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState('')
  const { profile } = useAuth()

  useEffect(() => {
    fetchGyms()
  }, [category])

  async function fetchGyms() {
    setLoading(true)
    setFetchError('')
    let query = supabase.from('gyms').select('*').order('rating', { ascending: false })
    if (category !== '전체') query = query.eq('category', category)
    const { data, error } = await query
    if (error) setFetchError(error.message)
    setGyms(data || [])
    setLoading(false)
  }

  const filtered = gyms.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 py-4">
      {/* 인사 */}
      <div className="mb-5">
        <p className="text-gray-500 text-sm">안녕하세요 👋</p>
        <h2 className="text-xl font-bold text-white">
          <span className="text-purple-400">{profile?.nickname || '게스트'}</span>님,
          오늘도 운동해요!
        </h2>
      </div>

      {/* 검색 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="헬스장 이름, 주소 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#13131f] border border-purple-900/30 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              category === cat
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'bg-[#13131f] text-gray-400 border border-gray-800 hover:border-purple-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 에러 메시지 */}
      {fetchError && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 mb-4">
          <p className="text-red-400 text-sm font-semibold mb-1">데이터를 불러오지 못했어요</p>
          <p className="text-red-300/70 text-xs break-all">{fetchError}</p>
        </div>
      )}

      {/* 헬스장 목록 */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <SlidersHorizontal className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {filtered.map(gym => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      )}
    </div>
  )
}

function GymCard({ gym }) {
  return (
    <Link to={`/gym/${gym.id}`} className="block">
      <div className="bg-[#13131f] rounded-2xl overflow-hidden border border-purple-900/20 hover:border-purple-600/50 transition group">
        {/* 이미지 */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={gym.image_urls?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'}
            alt={gym.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-3 left-3 bg-purple-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {gym.category}
          </span>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm font-bold">{gym.rating}</span>
            <span className="text-gray-300 text-xs">({gym.review_count})</span>
          </div>
        </div>

        {/* 정보 */}
        <div className="p-5">
          <h3 className="text-white font-bold text-base mb-2">{gym.name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{gym.address}</span>
          </div>
          {gym.price_info && (
            <p className="text-purple-400 text-sm font-semibold">{gym.price_info.split(' / ')[0]}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
