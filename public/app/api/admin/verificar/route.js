import { NextResponse } from 'next/server'
import crypto from 'crypto'

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.ADMIN_SECRET).digest('hex')
}

export async function POST(request) {
  try {
    const { password, hash } = await request.json()
    if (!password || !hash) {
      return NextResponse.json({ valido: false })
    }
    const hashIngresado = hashPassword(password)
    return NextResponse.json({ valido: hashIngresado === hash })
  } catch {
    return NextResponse.json({ valido: false })
  }
}