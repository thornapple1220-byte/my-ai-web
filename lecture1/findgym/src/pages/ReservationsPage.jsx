import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Star, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' })
  const { user } = useAuth()

  useEffect(() => { fetchReservations() }, [])

  async function fetchReservations() {
    const { data } = await supabase
      .from('reservations')
      .select('*, gyms(id, name, address, category, image_urls)')
      .eq('user_id', user.id)
      .order('reserved_date', { ascending: false })
    setReservations(data || [])
    setLoading(false)
  }

  async function submitReview(e) {
    e.preventDefault()
    await supabase.from('reviews').insert({
      gym_id: reviewModal.gyms.id,
      user_id: user.id,
      rating: reviewForm.rating,
      content: reviewForm.content,
    })
    await supabase.from('reservations').update({ has_review: true }).eq('id', reviewModal.id)
    setReviewModal(null)
    setReviewForm({ rating: 5, content: '' })
    fetchReservations()
    alert('후기가 등록되었습니다!')
  }

  async function cancelReservation(id) {
    if (!confirm('예약을 취소하시겠습니까?')) return
    await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id)
    fetchReservations()
  }

  const active = reservations.filter(r => r.status === 'confirmed')
  const cancelled = reservations.filter(r => r.status === 'cancelled')

  return (
    <div className="px-4 py-4">
      <h2 className="text-xl font-bold text-white mb-5">내 예약</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-gray-600 mb-4">예약 내역이 없습니다</p>
          <Link to="/" className="text-purple-400 font-semibold text-sm hover:text-purple-300">
            헬스장 둘러보기 →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-3">예약 중 ({active.length})</p>
              <div className="space-y-3">
                {active.map(r => (
                  <ReservationCard key={r.id} reservation={r} onReview={() => setReviewModal(r)} onCancel={() => cancelReservation(r.id)} />
                ))}
              </div>
            </div>
          )}
          {cancelled.length > 0 && (
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-3">취소됨 ({cancelled.length})</p>
              <div className="space-y-3 opacity-50">
                {cancelled.map(r => (
                  <ReservationCard key={r.id} reservation={r} cancelled />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 후기 모달 */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="w-full max-w-lg mx-auto bg-[#13131f] rounded-t-3xl p-6 border-t border-purple-900/50">
            <h3 className="text-white font-bold mb-1">{reviewModal.gyms?.name} 후기</h3>
            <p className="text-gray-500 text-sm mb-5">어떠셨나요?</p>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                    <Star className={`w-8 h-8 ${n <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewForm.content}
                onChange={e => setReviewForm(f => ({ ...f, content: e.target.value }))}
                placeholder="솔직한 후기를 남겨주세요"
                required
                rows={4}
                className="w-full bg-[#0a0a0f] border border-purple-900/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-purple-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setReviewModal(null)} className="py-3 rounded-xl text-gray-400 border border-gray-700">
                  취소
                </button>
                <button type="submit" className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600">
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ReservationCard({ reservation, onReview, onCancel, cancelled }) {
  const gym = reservation.gyms
  const isPast = new Date(reservation.reserved_date) < new Date()

  return (
    <div className="bg-[#13131f] rounded-2xl border border-purple-900/20 overflow-hidden">
      <div className="flex">
        <img
          src={gym?.image_urls?.[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200'}
          alt=""
          className="w-24 h-24 object-cover flex-shrink-0"
        />
        <div className="p-3 flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-purple-400 text-xs font-bold">{gym?.category}</span>
              <h4 className="text-white font-bold text-sm truncate">{gym?.name}</h4>
            </div>
            {!cancelled && (
              <button onClick={onCancel} className="text-gray-600 text-xs hover:text-red-400 ml-2 flex-shrink-0">
                취소
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
            <Calendar className="w-3 h-3" />
            {reservation.reserved_date}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            {reservation.reserved_time}
          </div>
        </div>
      </div>

      {!cancelled && isPast && !reservation.has_review && (
        <div className="px-3 pb-3">
          <button
            onClick={onReview}
            className="w-full py-2 rounded-xl bg-purple-900/30 border border-purple-700/40 text-purple-300 text-sm font-semibold hover:bg-purple-800/40 transition"
          >
            <Star className="w-3.5 h-3.5 inline mr-1" />후기 남기기
          </button>
        </div>
      )}
      {reservation.has_review && (
        <div className="px-3 pb-3">
          <p className="text-center text-gray-600 text-xs py-1">후기 작성 완료 ✓</p>
        </div>
      )}
    </div>
  )
}
