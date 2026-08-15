import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const SECRET = process.env.ADMIN_SECRET || 'uan-secret-key-evaluacion-clinica'

export async function POST(request) {
  try {
    const { adminId, token } = await request.json()
    if (!adminId || !token) {
      return NextResponse.json({ valido: false })
    }

    const { data: admin } = await supabase
      .from('administradores')
      .select('id, password_hash')
      .eq('id', adminId)
      .limit(1)
      .maybeSingle()

    if (!admin) {
      return NextResponse.json({ valido: false })
    }

    const expectedToken = crypto.createHmac('sha256', SECRET).update(`${admin.id}:${admin.password_hash}`).digest('hex')
    return NextResponse.json({ valido: expectedToken === token })
  } catch {
    return NextResponse.json({ valido: false })
  }
}