import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routers/AppRouter';



createRoot(document.getElementById('root')).render(
  <>
  <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-[#12191F] text-white px-4 py-3 rounded-lg shadow-lg relative',
          style: {
            border: '1px solid #333',
          },
          success: {
            icon: '✅',
            className: 'border-l-4 border-green-500',
            style: {
              background: '#111111',
            },
          },
          error: {
            icon: '❌',
            className: 'border-l-4 border-red-500',
            style: {
              background: '#111111',
            },
          },
          info: {
            icon: 'ℹ️',
            className: 'border-l-4 border-blue-500',
            style: {
              background: '#111111',
            },
          },
          warning: {
            icon: '⚠️',
            className: 'border-l-4 border-yellow-500',
            style: {
              background: '#111111',
            },
          },
        }}
      />
    <AppRouter />
  </>
);
