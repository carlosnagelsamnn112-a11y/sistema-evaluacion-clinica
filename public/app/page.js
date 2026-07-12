'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#111111',
        border: '1px solid #333333',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '22px',
          fontWeight: '500',
          marginBottom: '10px'
        }}>
          SISTEMA DE EVALUACIÓN CLÍNICA
        </h1>
        <p style={{
          color: '#888888',
          fontSize: '14px',
          marginBottom: '35px'
        }}>
          Universidad Antonio Nariño — Sede Neiva
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => router.push('/paciente')}
            style={{
              backgroundColor: '#222222',
              color: '#ffffff',
              border: '1px solid #444444',
              borderRadius: '8px',
              padding: '15px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            👤 Soy paciente
          </button>

          <button
            onClick={() => router.push('/admin/login')}
            style={{
              backgroundColor: '#1a1a2e',
              color: '#ffffff',
              border: '1px solid #333366',
              borderRadius: '8px',
              padding: '15px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🔐 Soy administrador
          </button>
        </div>
      </div>
    </main>
  )
}