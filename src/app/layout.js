import { AuthContextProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Ossify - Discover Open Source Projects',
  description: 'Find amazing open source repositories to contribute to',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
