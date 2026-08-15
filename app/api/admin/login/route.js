import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const SECRET = process.env.ADMIN_SECRET || 'uan-secret-key-evaluacion-clinica'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SECRET).digest('hex')
}

export async function POST(request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ valido: false, error: 'Contraseña requerida' })
    }

    const hashIngresado = hashPassword(password)

    const { data: admin, error } = await supabase
      .from('administradores')
      .select('id, nombre, password_hash')
      .eq('password_hash', hashIngresado)
      .limit(1)
      .maybeSingle()

    if (error || !admin) {
      return NextResponse.json({ valido: false, error: 'Contraseña incorrecta o administrador no registrado' })
    }

    const token = crypto.createHmac('sha256', SECRET).update(`${admin.id}:${admin.password_hash}`).digest('hex')

    return NextResponse.json({
      valido: true,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        token
      }
    })
  } catch {
    return NextResponse.json({ valido: false, error: 'Error al verificar credenciales' })
  }
}
