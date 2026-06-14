'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const s = {
  body: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  container: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' },
  h2: { color: '#fff', textAlign: 'center', marginBottom: '30px', fontWeight: '500', fontSize: '20px' },
  input: { width: '100%', padding: '12px 15px', margin: '5px 0 15px 0', border: '1px solid #333', borderRadius: '6px', fontSize: '15px', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '5px', color: '#ccc', fontWeight: '500', fontSize: '14px' },
  btn: { backgroundColor: '#1a1a2e', color: '#fff', border: '1px solid #333366', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  btnSecondary: { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', width: '100%' },
  error: { color: '#ff6666', fontSize: '14px', margin: '10px 0', padding: '12px', backgroundColor: '#220000', borderRadius: '6px', textAlign: 'center', border: '1px solid #cc0000' },
}

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Complete todos los campos'); return }
    setLoading(true)
    setError('')

    try {
      const { data, error: sbError } = await supabase
        .from('administradores')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (sbError || !data) { setError('Correo o contraseña incorrectos'); setLoading(false); return }

      // Verificar contraseña con API
      const res = await fetch('/api/admin/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, hash: data.password_hash })
      })
      const result = await res.json()

      if (!result.valido) { setError('Correo o contraseña incorrectos'); setLoading(false); return }

      // Guardar sesión en localStorage
      localStorage.setItem('adminSession', JSON.stringify({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        timestamp: Date.now()
      }))

      router.push('/admin/dashboard')
    } catch { setError('Error al iniciar sesión. Intente de nuevo') }
    setLoading(false)
  }

  return (
    <main style={s.body}>
      <div style={s.container}>
        <h2 style={s.h2}>🔐 Panel Administrador</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
          Sistema de Evaluación Clínica — UAN Neiva
        </p>
        <div>
          <label style={s.label}>Correo electrónico:</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div>
          <label style={s.label}>Contraseña:</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        {error && <div style={s.error}>{error}</div>}
        <button style={s.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Verificando...' : 'Ingresar'}
        </button>
        <button style={s.btnSecondary} onClick={() => router.push('/')}>
          ← Volver al inicio
        </button>
      </div>
    </main>
  )
}