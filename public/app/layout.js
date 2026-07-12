import './globals.css'

export const metadata = {
  title: 'Sistema de Evaluación Clínica',
  description: 'Universidad Antonio Nariño — Sede Neiva',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}