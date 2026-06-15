import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Star, MapPin, Phone, DollarSign, CheckCircle,
  Heart, Calendar, MessageSquare, User
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function GymDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [gym, setGym] = useState(null)
  const [reviews, setReviews] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' })
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [reserveDate, setReserveDate] = useState('')
  const [reserveTime, setReserveTime] = useState('10:00')

  useEffect(() => {
    fetchGym()
    fetchReviews()
    checkFavorite()
  }, [id])

  async function fetchGym() {
    const { data } = await supabase.from('gyms').select('*').eq('id', id).single()
    setGym(data)
    setLoading(false)
  }

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(nickname, avatar_url)')
      .eq('gym_id', id)
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  async function checkFavorite() {
    if (!user) return
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('gym_id', id)
      .eq('user_id', user.id)
      .single()
    setIsFavorite(!!data)
  }

  async function toggleFavorite() {
    if (!user) return
    if (isFavorite) {
      await supabase.from('favorites').delete().eq('gym_id', id).eq('user_id', user.id)
    } else {
      await supabase.from('favorites').insert({ gym_id: id, user_id: user.id })
    }
    setIsFavorite(!isFavorite)
  }

  async function submitReview(e) {
    e.preventDefault()
    await supabase.from('reviews').insert({
      gym_id: id,
      user_id: user.id,
      rating: reviewForm.rating,
      content: reviewForm.content,
    })
    setShowReviewForm(false)
    setReviewForm({ rating: 5, content: '' })
    fetchReviews()
  }

  async function makeReservation() {
    if (!reserveDate) return alert('날짜를 선택해주세요')
    await supabase.from('reservations').insert({
      gym_id: id,
      user_id: user.id,
      reserved_date: reserveDate,
      reserved_time: reserveTime,
    })
    setShowReserveModal(false)
    alert('예약이 완료되었습니다!')
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!gym) return <div className="p-4 text-center text-gray-500">헬스장을 찾을 수 없습니다.</div>

  return (
    <div className="pb-4">
      {/* 이미지 헤더 */}
      <div className="relative h-64">
        <img
          src={gym.image_urls?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'}
          alt={gym.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
        </button>

        <div className="absolute bottom-4 left-4">
          <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block">
            {gym.category}
          </span>
          <h1 className="text-white text-2xl font-black">{gym.name}</h1>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 font-bold">{gym.rating}</span>
            <span className="text-gray-300 text-sm">({gym.review_count}개 후기)</span>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="px-4 py-5 space-y-4">
        {/* 기본 정보 */}
        <div className="bg-[#13131f] rounded-2xl p-4 space-y-3 border border-purple-900/20">
          <InfoRow icon={<MapPin className="w-4 h-4 text-purple-400" />} label="주소" value={gym.address} />
          {gym.phone && <InfoRow icon={<Phone className="w-4 h-4 text-purple-400" />} label="연락처" value={gym.phone} />}
          {gym.price_info && <InfoRow icon={<DollarSign className="w-4 h-4 text-purple-400" />} label="가격" value={gym.price_info} />}
        </div>

        {/* 시설 정보 */}
        {gym.facilities?.length > 0 && (
          <div className="bg-[#13131f] rounded-2xl p-4 border border-purple-900/20">
            <h3 className="text-white font-bold mb-3">시설 정보</h3>
            <div className="flex flex-wrap gap-2">
              {gym.facilities.map(f => (
                <div key={f} className="flex items-center gap-1.5 bg-purple-900/20 border border-purple-800/30 rounded-full px-3 py-1">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-sm text-gray-300">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 설명 */}
        {gym.description && (
          <div className="bg-[#13131f] rounded-2xl p-4 border border-purple-900/20">
            <h3 className="text-white font-bold mb-2">소개</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{gym.description}</p>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowReserveModal(true)}
            className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition"
          >
            <Calendar className="w-4 h-4 inline mr-1.5" />예약하기
          </button>
          <a
            href={`tel:${gym.phone}`}
            className="py-3 rounded-xl font-bold text-purple-300 border border-purple-700/50 flex items-center justify-center gap-1.5 hover:bg-purple-900/20 transition"
          >
            <Phone className="w-4 h-4" />문의하기
          </a>
        </div>

        {/* 후기 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">후기 ({reviews.length})</h3>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-purple-400 text-sm font-semibold hover:text-purple-300"
            >
              + 후기 작성
            </button>
          </div>

          {/* 후기 작성 폼 */}
          {showReviewForm && (
            <form onSubmit={submitReview} className="bg-[#13131f] rounded-2xl p-4 mb-4 border border-purple-700/40">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                    <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.content}
                onChange={e => setReviewForm(f => ({ ...f, content: e.target.value }))}
                placeholder="후기를 작성해주세요"
                required
                rows={3}
                className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="mt-2 w-full py-2 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition"
              >
                등록
              </button>
            </form>
          )}

          {/* 후기 목록 */}
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-[#13131f] rounded-xl p-4 border border-purple-900/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-purple-900 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300 text-sm font-semibold">{review.profiles?.nickname || '익명'}</span>
                  <div className="flex ml-auto">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{review.content}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-gray-600 py-6 text-sm">아직 후기가 없습니다</p>
            )}
          </div>
        </div>
      </div>

      {/* 예약 모달 */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full max-w-lg mx-auto bg-[#13131f] rounded-t-3xl p-6 border-t border-purple-900/50">
            <h3 className="text-white font-bold text-lg mb-5">{gym.name} 예약하기</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">날짜</label>
                <input
                  type="date"
                  value={reserveDate}
                  onChange={e => setReserveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">시간</label>
                <select
                  value={reserveTime}
                  onChange={e => setReserveTime(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  {['06:00','07:00','08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowReserveModal(false)}
                  className="py-3 rounded-xl text-gray-400 border border-gray-700"
                >취소</button>
                <button
                  onClick={makeReservation}
                  className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600"
                >예약하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-gray-200 text-sm">{value}</p>
      </div>
    </div>
  )
}
