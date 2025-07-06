// StyledToast.js
import { toast } from 'react-hot-toast';

const StyledToast = {
  success: (message = 'Success!') =>
    toast.custom((t) => renderToast(t, message, '✅', 'border-green-500', 'bg-green-500')),

  error: (message = 'Something went wrong!') =>
    toast.custom((t) => renderToast(t, message, '❌', 'border-red-500', 'bg-red-500')),

  info: (message = 'Info') =>
    toast.custom((t) => renderToast(t, message, 'ℹ️', 'border-blue-500', 'bg-blue-500')),

  warning: (message = 'Warning!') =>
    toast.custom((t) => renderToast(t, message, '⚠️', 'border-yellow-500', 'bg-yellow-500')),

  custom: (message, icon = '🔥', border = 'border-purple-500', bar = 'bg-purple-500') =>
    toast.custom((t) => renderToast(t, message, icon, border, bar)),
};

// Reusable toast render function
const renderToast = (t, message, icon, borderColor, barColor) => (
  <div
    className={`bg-[#111111] text-white px-4 py-3 rounded-lg shadow-lg relative w-80 max-w-[90vw] border-l-4 ${borderColor} ${
      t.visible ? 'animate-slide-in' : 'animate-fade-out'
    }`}
  >
    <div className="flex justify-between items-center">
      <span>{icon} {message}</span>
      <button onClick={() => toast.dismiss(t.id)} className="text-xl ml-4">×</button>
    </div>
    <div className={`mt-2 h-1 rounded-full ${barColor} animate-pulse`} />
  </div>
);

export default StyledToast;
