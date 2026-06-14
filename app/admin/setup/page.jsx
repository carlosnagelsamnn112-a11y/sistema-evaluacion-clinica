'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const s = {
  body: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  container: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' },
  h2: { color: '#fff', textAlign: 'center', marginBottom: '10px', fontWeight: '500', fontSize: '20px' },
  input: { width: '100%', padding: '12px 15px', margin: '5px 0 15px 0', border: '1px solid #333', borderRadius: '6px', fontSize: '15px', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '5px', color: '#ccc', fontWeight: '500', fontSize: '14px' },
  btn: { backgroundColor: '#1a1a2e', color: '#fff', border: '1px solid #333366', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  error: { color: '#ff6666', fontSize: '14px', margin: '10px 0', padding: '12px', backgroundColor: '#220000', borderRadius: '6px', textAlign: 'center', border: '1px solid #cc0000' },
  success: { color: '#00ff00', fontSize: '14px', margin: '10px 0', padding: '12px', backgroundColor: '#002200', borderRadius: '6px', textAlign: 'center', border: '1px solid #00aa00' },
}

export default function Setup() {
  const router = useRouter()
  const [form, setForm] = useState({ secretKey: '', nombre: '', email: '', password: '', confirmar: '' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [loading, setLoading] = useState(false)

  const crear = async () => {
    setError('')
    setExito('')
    if (!form.secretKey || !form.nombre || !form.email || !form.password) { setError('Complete todos los campos'); return }
    if (form.password !== form.confirmar) { setError('Las contraseñas no coinciden'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secretKey: form.secretKey,
          nombre: form.nombre,
          email: form.email,
          password: form.password
        })
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Error al crear administrador'); setLoading(false); return }
      setExito(`✓ Administrador "${data.admin.nombre}" creado correctamente. Redirigiendo al login...`)
      setTimeout(() => router.push('/admin/login'), 2500)
    } catch { setError('Error de conexión. Intente de nuevo') }
    setLoading(false)
  }

  return (
    <main style={s.body}>
      <div style={s.container}>
        <h2 style={s.h2}>⚙️ Crear Administrador</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '25px', fontSize: '13px' }}>
          Esta página solo debe usarse una vez para crear el primer administrador.
        </p>
        <div>
          <label style={s.label}>Clave secreta del sistema:</label>
          <input style={s.input} type="password" value={form.secretKey} onChange={e => setForm({ ...form, secretKey: e.target.value })} placeholder="Clave configurada en .env.local" />
        </div>
        <div>
          <label style={s.label}>Nombre completo:</label>
          <input style={s.input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del administrador" />
        </div>
        <div>
          <label style={s.label}>Correo electrónico:</label>
          <input style={s.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label style={s.label}>Contraseña:</label>
          <input style={s.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 8 caracteres" />
        </div>
        <div>
          <label style={s.label}>Confirmar contraseña:</label>
          <input style={s.input} type="password" value={form.confirmar} onChange={e => setForm({ ...form, confirmar: e.target.value })} placeholder="Repita la contraseña" onKeyDown={e => e.key === 'Enter' && crear()} />
        </div>
        {error && <div style={s.error}>{error}</div>}
        {exito && <div style={s.success}>{exito}</div>}
        <button style={s.btn} onClick={crear} disabled={loading}>
          {loading ? 'Creando...' : 'Crear administrador'}
        </button>
      </div>
    </main>
  )
}