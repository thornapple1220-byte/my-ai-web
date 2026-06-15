import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) { setIsGuest(false); fetchProfile(session.user.id) }
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  function enterGuestMode() {
    setIsGuest(true)
  }

  async function signUp({ username, password, nickname }) {
    const { data, error } = await supabase.auth.signUp({
      email: `${username}@findgym.local`,
      password,
      options: { data: { username, nickname } },
    })
    if (error) return { data, error }

    // 이메일 인증 없이 가입 즉시 로그인
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${username}@findgym.local`,
      password,
    })
    return { data: signInData, error: signInError }
  }

  async function signIn({ username, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@findgym.local`,
      password,
    })
    return { data, error }
  }

  async function signOut() {
    setIsGuest(false)
    await supabase.auth.signOut()
  }

  async function checkUsername(username) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()
    return !!data
  }

  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error) setProfile(data)
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isGuest, enterGuestMode, signUp, signIn, signOut, checkUsername, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
