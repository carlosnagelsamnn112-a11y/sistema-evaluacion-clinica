'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const s = {
  body: { backgroundColor: '#08080c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'var(--font-sans)' },
  container: { backgroundColor: '#111218', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)' },
  h2: { color: '#fff', textAlign: 'center', marginBottom: '30px', fontWeight: '500', fontSize: '20px' },
  input: { width: '100%', padding: '12px 15px', margin: '5px 0 15px 0', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '15px', backgroundColor: '#15161e', color: '#fff', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '5px', color: '#9ca3af', fontWeight: '500', fontSize: '14px' },
  btn: { backgroundColor: '#1b1d26', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  btnSecondary: { backgroundColor: '#111218', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', width: '100%' },
  error: { color: '#f87171', fontSize: '14px', margin: '10px 0', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.12)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' },
}

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!password) { setError('Ingrese la contraseña'); return }
    setLoading(true)
    setError('')

    try {
      const { data, error: sbError } = await supabase
        .from('administradores')
        .select('*')

      if (sbError || !data || data.length === 0) {
        setError('No hay administradores registrados')
        setLoading(false)
        return
      }

      // Verificar contraseña contra todos los admins
      let adminValido = null
      for (const admin of data) {
        const res = await fetch('/api/admin/verificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, hash: admin.password_hash })
        })
        const result = await res.json()
        if (result.valido) { adminValido = admin; break }
      }

      if (!adminValido) {
        setError('Contraseña incorrecta')
        setLoading(false)
        return
      }

      localStorage.setItem('adminSession', JSON.stringify({
        id: adminValido.id,
        nombre: adminValido.nombre,
        timestamp: Date.now()
      }))

      router.push('/admin/dashboard')
    } catch {
      setError('Error al iniciar sesión. Intente de nuevo')
    }
    setLoading(false)
  }

  return (
    <main style={s.body}>
      <style>{`
        button { transition: all 0.2s ease; }
        button:hover { filter: brightness(1.2); transform: translateY(-1px); }
        button:active { transform: translateY(0) scale(0.98); }
        input { transition: all 0.2s ease; }
        input:focus { border-color: #fbbf24 !important; box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.15); }
      `}</style>
      <div style={s.container}>
        <h2 style={s.h2}>🔐 Panel Administrador</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '25px', fontSize: '14px' }}>
          Sistema de Evaluación Clínica — UAN Neiva
        </p>
        <div>
          <label style={s.label}>Contraseña:</label>
          <input
            style={s.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
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