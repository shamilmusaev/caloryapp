import "./globals.css";

export const metadata = {
  title: "Callory Tracker",
  description: "Track your calories easily",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Manrope', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
