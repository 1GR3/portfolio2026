import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/preloader-circle.scss';

const SIZE = 320;
const INSET = 2;
const CENTER = SIZE / 2;
const RADIUS = CENTER - INSET;

function getSectorPath(progress) {
  if (progress <= 0) return '';
  if (progress >= 100) {
    return `M ${SIZE / 2} ${SIZE / 2} m -${RADIUS}, 0 a ${RADIUS},${RADIUS} 0 1,0 ${
      RADIUS * 2
    },0 a ${RADIUS},${RADIUS} 0 1,0 -${RADIUS * 2},0`;
  }

  const cx = CENTER;
  const cy = CENTER;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (progress / 100) * Math.PI * 2;
  const x0 = cx + RADIUS * Math.cos(startAngle);
  const y0 = cy + RADIUS * Math.sin(startAngle);
  const x1 = cx + RADIUS * Math.cos(endAngle);
  const y1 = cy + RADIUS * Math.sin(endAngle);
  const largeArcFlag = progress > 50 ? 1 : 0;

  return `M ${cx} ${cy} L ${x0} ${y0} A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x1} ${y1} Z`;
}

function PreloaderCircle({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const rootRef = useRef(null);
  const percentRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    let frameId;
    const durationMs = 3200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(next);

      if (next < 100) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  useLayoutEffect(() => {
    if (progress !== 100) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(percentRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out'
      })
        .to(
          progressRef.current,
          {
            opacity: 1,
            duration: 0.1,
            ease: 'power2.out',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          },
          '<'
        );
    }, rootRef);

    return () => ctx.revert();
  }, [progress, onComplete]);

  const sectorPath = getSectorPath(progress);

  return (
    <section className="preloader-circle" ref={rootRef} aria-label="Loading screen">
      <div className="preloader-circle__wrap">
        <svg
          className="preloader-circle__svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label={`Loading ${progress}%`}
        >
          <path ref={progressRef} className="preloader-circle__progress" d={sectorPath} />
        </svg>

        <div ref={percentRef} className="preloader-circle__percent" aria-live="polite">
          {progress}%
        </div>
      </div>
    </section>
  );
}

export default PreloaderCircle;
