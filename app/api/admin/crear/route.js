import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.ADMIN_SECRET).digest('hex')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { secretKey, nombre, email, password } = body

    if (!secretKey || !nombre || !email || !password) {
      return NextResponse.json({ success: false, error: 'Faltan campos requeridos' })
    }

    if (secretKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Clave secreta incorrecta' }, { status: 401 })
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'La contraseña debe tener al menos 8 caracteres' })
    }

    const passwordHash = hashPassword(password)

    const { data, error } = await supabase
      .from('administradores')
      .insert({
        nombre: nombre,
        email: email.toLowerCase().trim(),
        password_hash: passwordHash
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: false, error: 'Este correo ya está registrado' })
      }
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({
      success: true,
      admin: { id: data.id, nombre: data.nombre, email: data.email }
    })

  } catch (e) {
    return NextResponse.json({ success: false, error: e.message })
  }
}