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
  ['_', '-', '|', '_', ' '],
  ['g', 'q', '9', 'G'],
  ['я', '', 'r̄', 'R', 'r'],
  ['3', 'E', 'e'],
  ['8', 'q', '9', 'G', 'g'],
  ['o', '?', 'Ø', '¿', 'v', 'V', 'ü', 'ŭ', 'ũ', 'ū', 'ų', 'ư', 'µ', 'u'],
  ['Я', 'я', 'Ԅ', 'r̄', 'R', 'ř', 'r'],
  ['i', 'y', 'Σ', '3', '⊆', 'c', '3', 'Є', 'E', 'e'],
  ['(', 'C', 'c', 'ć', 'č', 'ç', 'ĉ', 'ℂ', 'ⓒ', '¢', 'c']
];

function NameAnimation({ isLoading, isRevealing, onLoadingComplete }) {
  const heroRef = useRef(null);
  const charRefs = useRef([]);
  const revealCircleRef = useRef(null);

  useLayoutEffect(() => {
    if (isLoading || isRevealing) return;

    const ctx = gsap.context(() => {
      const chars = charRefs.current;
      const revealCircle = revealCircleRef.current;
      const cycleStep = 0.08;
      const charOffset = 0.35;
      const circlePhaseDuration = 2;
      const circleTargetScale = 1 / 16;

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
        tl.to(revealCircle, {
          scale: circleTargetScale,
          left: '95%',
          duration: circlePhaseDuration,
          ease: 'none'
        });
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
        <div className="hero-i-rect" aria-hidden="true">
          <h2>Welcome!</h2>
          <p>My name is ... </p>
        </div>
      )}
      {!isLoading && <div className="hero-reveal-circle" ref={revealCircleRef} aria-hidden="true" />}
      {!isLoading && <Menu />}
      <h1 className="name" aria-label="Ivo Gregurec">
        {characterSets.map((set, index) => {
          const charNode = (
            <span
              key={`char-${index}`}
              className="char"
              ref={(el) => {
                if (el) charRefs.current.push(el);
              }}
            >
              {set[0] === ' ' ? '\u00A0' : ''}
            </span>
          );

          if (index === 3) {
            return (
              <span key={`line-${index}`}>
                {charNode}
                <br />
              </span>
            );
          }

          return charNode;
        })}
      </h1>
    </section>
  );
}

export default NameAnimation;
