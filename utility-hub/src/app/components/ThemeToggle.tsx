"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle Theme"
      className="px-3 py-2 rounded-lg font-medium transition-colors duration-200"
      style={{
        background: 'var(--btn-primary)',
        color: 'var(--btn-text)',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
