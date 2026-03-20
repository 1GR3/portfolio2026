import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PreloaderCircle from './PreloaderCircle';
import Menu from './Menu';

gsap.registerPlugin(ScrollTrigger);

const characterSets = [
  ['i', '1', 'I'],
  ['V', 'w', 'ѵ', 'v'],
  ['0', 'Ѻ', 'Ѳ', 'Ø', 'o'],
  ['_', '-', '|', '_', ' ', ''],
  ['g', 'q', '9', 'G'],
  ['я', '', 'r̄', 'R', 'r'],
  ['3', 'E', 'e'],
  ['8', 'q', '9', 'G', 'g'],
  ['o', '?', 'Ø', '¿', 'v', 'V', 'ü', 'ŭ', 'ũ', 'ū', 'ų', 'ư', 'µ', 'u'],
  ['Я', 'रि', 'я', 'Ԅ', 'r̄', 'R', 'ř', 'r'],
  ['i', 'y', 'Σ', '3', '⊆', 'c', '3', 'Є', 'E', 'e'],
  ['(', 'C', 'c', 'ć', 'č', 'ç', 'ĉ', 'ℂ', 'ⓒ', '¢', 'c']
];

const ARC_START_DEG = 135;
const ARC_END_DEG = 360;
const ARC_SPAN_DEG = ARC_END_DEG - ARC_START_DEG;
const RING_CONFIGS = [
  {
    id: 'dash-1',
    dasharray: '2 6',
    dashoffset: 0,
    strokeWidth: 0.9,
    animation: { to: -24, duration: 3 },
    trimMode: 'start',
    trimDegrees: ARC_SPAN_DEG
  },
  {
    id: 'dash-2',
    dasharray: '8 10',
    dashoffset: 0,
    strokeWidth: 0.9,
    trimMode: 'both',
    trimDegrees: ARC_SPAN_DEG
  },
  {
    id: 'dash-3',
    dasharray: '1 4',
    dashoffset: 0,
    strokeWidth: 0.9,
    animation: { to: 18, duration: 5 },
    trimMode: 'end',
    trimDegrees: ARC_SPAN_DEG
  },
  {
    id: 'dash-4',
    dasharray: '14 8 2 10',
    dashoffset: 0,
    strokeWidth: 0.9,
    animation: { to: -32, duration: 2 },
    trimMode: 'both',
    trimDegrees: ARC_SPAN_DEG
  },
  {
    id: 'solid-1',
    dasharray: 'none',
    dashoffset: 0,
    strokeWidth: 1,
    trimMode: 'start',
    trimDegrees: ARC_SPAN_DEG
  },
  {
    id: 'solid-2',
    dasharray: 'none',
    dashoffset: 0,
    strokeWidth: 1,
    trimMode: 'end',
    trimDegrees: ARC_SPAN_DEG
  },
  {
    id: 'solid-3',
    dasharray: 'none',
    dashoffset: 0,
    strokeWidth: 2,
    trimMode: 'both',
    trimDegrees: ARC_SPAN_DEG
  }
];

const RANDOM_RING_FACTORS = [0.16, 0.52, 0.87];

function getRingMetrics() {
  const vmax = typeof window === 'undefined' ? 1200 : Math.max(window.innerWidth, window.innerHeight);
  const smallestDiameter = vmax * 0.6;
  const largestDiameter = vmax * 1.1;
  const smallestRadius = smallestDiameter / 2;
  const largestRadius = largestDiameter / 2;
  const dashedCount = 4;
  const dashedStep = (largestRadius - smallestRadius) / (dashedCount - 1);
  const radiusRange = largestRadius - smallestRadius;
  const padding = 24;
  const svgSize = largestDiameter + padding * 2;
  const center = svgSize / 2;

  return {
    svgSize,
    center,
    rings: RING_CONFIGS.map((ring, index) => ({
      ...ring,
      radius:
        index < dashedCount
          ? smallestRadius + dashedStep * index
          : smallestRadius + radiusRange * RANDOM_RING_FACTORS[index - dashedCount]
    }))
  };
}

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad)
  };
}

function getArcPath(cx, cy, radius, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, radius, startDeg);
  const end = polarToCartesian(cx, cy, radius, endDeg);
  const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function getTrimmedAngles(progress, trimMode, trimDegrees) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const trimAmount = trimDegrees * clampedProgress;
  let startDeg = ARC_START_DEG;
  let endDeg = ARC_END_DEG;

  if (trimMode === 'start') {
    startDeg += trimAmount;
  } else if (trimMode === 'end') {
    endDeg -= trimAmount;
  } else {
    startDeg += trimAmount / 2;
    endDeg -= trimAmount / 2;
  }

  if (endDeg <= startDeg) return null;

  return { startDeg, endDeg };
}

function NameAnimation({ isLoading, isRevealing, onLoadingComplete }) {
  const RECT_TITLE_TEXT = 'Welcome!';
  const RECT_BODY_TEXT = 'My name is ...';
  const RING_REVEAL_DURATION = 0.9;
  const heroRef = useRef(null);
  const charRefs = useRef([]);
  const revealCircleRef = useRef(null);
  const ringLayerRef = useRef(null);
  const ringRefs = useRef([]);
  const heroRectRef = useRef(null);
  const heroRectTitleRef = useRef(null);
  const heroRectBodyRef = useRef(null);
  const [ringMetrics, setRingMetrics] = useState(() => getRingMetrics());

  useEffect(() => {
    const updateRingMetrics = () => {
      setRingMetrics(getRingMetrics());
    };

    updateRingMetrics();
    window.addEventListener('resize', updateRingMetrics);

    return () => window.removeEventListener('resize', updateRingMetrics);
  }, []);

  useLayoutEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      const ringLayer = ringLayerRef.current;
      const revealCircle = revealCircleRef.current;

      if (!ringLayer) return;

      const preloaderDiameter = revealCircle?.offsetWidth ?? 0;
      const initialScale =
        preloaderDiameter > 0 ? preloaderDiameter / ringMetrics.svgSize : 0.12;

      if (isRevealing) {
        gsap.fromTo(
          ringLayer,
          {
            scale: initialScale,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: RING_REVEAL_DURATION,
            ease: 'power3.out'
          }
        );

        return;
      }

      gsap.set(ringLayer, {
        scale: 1,
        opacity: 1
      });
    }, heroRef);

    return () => ctx.revert();
  }, [isLoading, isRevealing, ringMetrics]);

  useLayoutEffect(() => {
    if (isLoading || isRevealing) return;

    const ctx = gsap.context(() => {
      const chars = charRefs.current;
      const revealCircle = revealCircleRef.current;
      const ringLayer = ringLayerRef.current;
      const heroRect = heroRectRef.current;
      const heroRectTitle = heroRectTitleRef.current;
      const heroRectBody = heroRectBodyRef.current;
      const cycleStep = 0.08;
      const charOffset = 0.35;
      const circlePhaseDuration = 3;
      const circleStepDuration = circlePhaseDuration / 3;
      const circleTargetScale = 1 / 16;
      const moveStepStart = circleStepDuration;
      const lowerStepStart = circleStepDuration * 2;
      const rectFullText = `${RECT_TITLE_TEXT}${RECT_BODY_TEXT}`;

      if (heroRectTitle) heroRectTitle.textContent = RECT_TITLE_TEXT;
      if (heroRectBody) heroRectBody.textContent = RECT_BODY_TEXT;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 6}`,
          scrub: true,
          pin: true
        }
      });

      if (ringLayer) {
        ringRefs.current.forEach((ring, index) => {
          const animation = ringMetrics.rings[index]?.animation;

          if (!ring || !animation) return;

          gsap.to(ring, {
            strokeDashoffset: animation.to,
            duration: animation.duration,
            repeat: -1,
            ease: 'none'
          });
        });

        ringMetrics.rings.forEach((ringConfig, index) => {
          const ringEl = ringRefs.current[index];
          const trimState = { progress: 0 };

          if (!ringEl) return;

          tl.to(
            trimState,
            {
              progress: 1,
              duration: circlePhaseDuration,
              ease: 'none',
              onUpdate: () => {
                const trimmedAngles = getTrimmedAngles(
                  trimState.progress,
                  ringConfig.trimMode,
                  ringConfig.trimDegrees
                );

                if (!trimmedAngles) {
                  ringEl.setAttribute('d', '');
                  return;
                }

                ringEl.setAttribute(
                  'd',
                  getArcPath(
                    ringMetrics.center,
                    ringMetrics.center,
                    ringConfig.radius,
                    trimmedAngles.startDeg,
                    trimmedAngles.endDeg
                  )
                );
              }
            },
            0
          );
        });
      }

      if (revealCircle) {
        tl.to(
          revealCircle,
          {
            scale: circleTargetScale,
            duration: circleStepDuration,
            ease: 'none'
          },
          0
        )
          .to(
            revealCircle,
            {
              left: '95%',
              duration: circleStepDuration,
              ease: 'none'
            },
            moveStepStart
          )
          .to(
            revealCircle,
            {
              top: 'calc(78% - 4.2em)',
              duration: circleStepDuration,
              ease: 'none'
            },
            lowerStepStart
          );

        if (heroRect) {
          tl.to(
            heroRect,
            {
              '--i-rect-width': '1vw',
              '--i-pointer-scale': 0,
              '--i-rect-right': '2rem',
              duration: circleStepDuration,
              ease: 'none'
            },
            moveStepStart
          );
        }

        if (heroRectTitle && heroRectBody) {
          const textState = { count: rectFullText.length };
          tl.to(
            textState,
            {
              count: 0,
              duration: circleStepDuration,
              ease: 'none',
              onUpdate: () => {
                const visible = Math.max(0, Math.floor(textState.count));
                const current = rectFullText.slice(0, visible);
                heroRectTitle.textContent = current.slice(0, RECT_TITLE_TEXT.length);
                heroRectBody.textContent = current.slice(RECT_TITLE_TEXT.length);
              },
              onReverseComplete: () => {
                heroRectTitle.textContent = RECT_TITLE_TEXT;
                heroRectBody.textContent = RECT_BODY_TEXT;
              }
            },
            moveStepStart
          );
        }

        tl.set(
          [revealCircle, ringLayer, heroRect].filter(Boolean),
          {
            opacity: 0
          },
          circlePhaseDuration
        );
      }

      characterSets.forEach((set, index) => {
        const el = chars[index];
        const startAt = circlePhaseDuration + index * charOffset;
        const blank = set[0] === ' ' ? '\u00A0' : '';

        if (!el) return;

        el.textContent = blank;

        const state = { frame: -1 };

        tl.to(
          state,
          {
            frame: set.length - 1,
            duration: cycleStep * set.length,
            ease: 'none',
            onUpdate: () => {
              const frameIndex = Math.floor(state.frame);
              el.textContent =
                frameIndex < 0
                  ? blank
                  : set[frameIndex] === ' '
                    ? '\u00A0'
                    : set[frameIndex];
            },
            onReverseComplete: () => {
              el.textContent = blank;
            }
          },
          startAt
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, [isLoading, isRevealing, ringMetrics]);

  charRefs.current = [];
  ringRefs.current = [];

  return (
    <section
      id="top"
      className={`hero${isLoading ? ' hero--loading' : ''}${isRevealing ? ' hero--revealing' : ''}`}
      ref={heroRef}
    >
      {isLoading && <PreloaderCircle onComplete={onLoadingComplete} />}
      {!isLoading && (
        <div className="hero-i-rect" ref={heroRectRef} aria-hidden="true">
          <h2 ref={heroRectTitleRef}>{RECT_TITLE_TEXT}</h2>
          <p ref={heroRectBodyRef}>{RECT_BODY_TEXT}</p>
        </div>
      )}
      {!isLoading && (
        <div className="hero-reveal-circle" ref={revealCircleRef} aria-hidden="true" />
      )}
      {!isLoading && (
        <div className="hero-reveal-rings-layer" ref={ringLayerRef} aria-hidden="true">
          <svg
            className="hero-reveal-rings"
            viewBox={`0 0 ${ringMetrics.svgSize} ${ringMetrics.svgSize}`}
            role="presentation"
            style={{
              width: `${ringMetrics.svgSize}px`,
              height: `${ringMetrics.svgSize}px`
            }}
          >
            {ringMetrics.rings.map((ring, index) => (
              <path
                key={ring.id}
                ref={(el) => {
                  ringRefs.current[index] = el;
                }}
                className="hero-reveal-rings__arc"
                d={getArcPath(
                  ringMetrics.center,
                  ringMetrics.center,
                  ring.radius,
                  ARC_START_DEG,
                  ARC_END_DEG
                )}
                style={{
                  strokeDasharray: ring.dasharray,
                  strokeDashoffset: ring.dashoffset,
                  strokeWidth: ring.strokeWidth
                }}
              />
            ))}
          </svg>
        </div>
      )}
      {!isLoading && <Menu />}
      <h1 className="name" aria-label="Ivo Gregurec">
        <span className="name__line name__line--first">
          {characterSets.slice(0, 4).map((set, index) => (
            <span
              key={`char-first-${index}`}
              className="char"
              ref={(el) => {
                if (el) charRefs.current.push(el);
              }}
            >
              {set[0] === ' ' ? '\u00A0' : ''}
            </span>
          ))}
        </span>
        <span className="name__line name__line--last">
          {characterSets.slice(4).map((set, index) => (
            <span
              key={`char-last-${index}`}
              className="char"
              ref={(el) => {
                if (el) charRefs.current.push(el);
              }}
            >
              {set[0] === ' ' ? '\u00A0' : ''}
            </span>
          ))}
        </span>
      </h1>
    </section>
  );
}

export default NameAnimation;
