import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';

type LayoutProps = { children: ReactNode };

const Layout = ({ children }: LayoutProps) => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        removeDelay: 1000,
        style: { background: '#363636', color: '#fff' },
        success: {
          duration: 3000,
          iconTheme: { primary: 'green', secondary: 'black' },
        },
      }}
    />
    <Header />
    <main className="p-4">{children}</main>
  </>
);

export default Layout;
