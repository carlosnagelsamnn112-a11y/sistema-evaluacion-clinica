import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.ADMIN_SECRET).digest('hex')
}

export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ valido: false, error: 'Contraseña requerida' })
    }

    const { data: admins, error } = await supabase.from('administradores').select('*')

    if (error || !admins || admins.length === 0) {
      return NextResponse.json({ valido: false, error: 'No hay administradores registrados' })
    }

    const hashIngresado = hashPassword(password)

    for (const admin of admins) {
      if (hashIngresado === admin.password_hash) {
        return NextResponse.json({
          valido: true,
          admin: {
            id: admin.id,
            nombre: admin.nombre
          }
        })
      }
    }

    return NextResponse.json({ valido: false, error: 'Contraseña incorrecta' })
  } catch {
    return NextResponse.json({ valido: false, error: 'Error al verificar' })
  }
}
