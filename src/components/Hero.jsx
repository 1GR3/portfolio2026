import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAME = 'Ivo Gregurec';

function Hero() {
  const sectionRef = useRef(null);
  const charsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(charsRef.current, { opacity: 0, y: 40 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: true
        }
      }).to(charsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.18,
        ease: 'none'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  charsRef.current = [];

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__inner">
        <p className="hero__kicker">Portfolio 2026</p>
        <h1 className="hero__title" aria-label={NAME}>
          {NAME.split('').map((char, index) => (
            <span
              className="hero__char"
              key={`${char}-${index}`}
              ref={(el) => {
                if (el) charsRef.current.push(el);
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}

export default Hero;
