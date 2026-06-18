import { useEffect, useRef } from 'react';

const CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプ0123456789';

export function useMatrixAnimation(active, { crisp = true } = {}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    const fontSize = crisp ? 18 : 16;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let cols = Math.floor(width / fontSize);
    let drops = new Array(cols).fill(1);
    let animationId = null;

    canvas.style.opacity = crisp ? '1' : '0.22';

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.floor(width / fontSize);
      drops = new Array(cols).fill(1);
      if (crisp) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      }
    }

    function draw() {
      if (crisp) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00ff41';
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#39ff14';
      }
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    }

    if (crisp) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    }

    window.addEventListener('resize', resize);
    draw();

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.classList.add('hidden');
    };
  }, [active, crisp]);

  return canvasRef;
}
