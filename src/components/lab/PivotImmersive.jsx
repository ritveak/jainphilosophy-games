import { useEffect, useState } from 'react';
import { useMatrixAnimation } from '../../hooks/useMatrixAnimation';

export default function PivotImmersive({ active, children }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useMatrixAnimation(active && visible, { crisp: true });

  useEffect(() => {
    if (active) {
      setMounted(true);
      document.body.classList.add('pivot-locked');
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      document.body.classList.remove('pivot-locked');
      const timer = setTimeout(() => setMounted(false), 850);
      return () => clearTimeout(timer);
    }
    return () => document.body.classList.remove('pivot-locked');
  }, [active]);

  if (!mounted) return null;

  return (
    <div
      className={`pivot-immersive${visible ? ' is-active' : ''}`}
      aria-hidden={!active}
    >
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="pivot-immersive-vignette" />
      <div className="pivot-immersive-content">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
