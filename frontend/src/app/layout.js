import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    // Added suppressHydrationWarning to html tag
    <html lang="en" suppressHydrationWarning={true}>
      {/* Added suppressHydrationWarning to body tag as well, just in case */}
      <body className="bg-gray-50" suppressHydrationWarning={true}>
        <Navbar />
        <main className="container mx-auto p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}