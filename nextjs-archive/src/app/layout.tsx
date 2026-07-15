import '../styles/globals.css';

export const metadata = {
  title: 'All Sarkari Yojana - Dynamic API Backend',
  description: 'Enterprise Government Information Portal API Backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
