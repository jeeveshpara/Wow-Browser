
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The lang attribute is managed by the NextIntlProvider in the locale-specific layout
    <html className="dark" suppressHydrationWarning>
      <head>
        <title>Wow Browser</title>
        <meta name="description" content="A privacy-focused web browser built with Next.js featuring ad blocking, bookmarks, and private browsing." />
        <meta property="og:title" content="Wow Browser" />
        <meta property="og:description" content="A privacy-focused web browser built with Next.js featuring ad blocking, bookmarks, and private browsing." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
