import { useLayoutEffect, useRef } from 'react';
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

function NameAnimation({ isLoading, isRevealing, onLoadingComplete }) {
  const RECT_TITLE_TEXT = 'Welcome!';
  const RECT_BODY_TEXT = 'My name is ...';
  const heroRef = useRef(null);
  const charRefs = useRef([]);
  const revealCircleRef = useRef(null);
  const heroRectRef = useRef(null);
  const heroRectTitleRef = useRef(null);
  const heroRectBodyRef = useRef(null);

  useLayoutEffect(() => {
    if (isLoading || isRevealing) return;

    const ctx = gsap.context(() => {
      const chars = charRefs.current;
      const revealCircle = revealCircleRef.current;
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
          [revealCircle, heroRect].filter(Boolean),
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
  }, [isLoading, isRevealing]);

  charRefs.current = [];

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
      {!isLoading && <div className="hero-reveal-circle" ref={revealCircleRef} aria-hidden="true" />}
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
