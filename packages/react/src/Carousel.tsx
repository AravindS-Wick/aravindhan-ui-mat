import React, { useState, useEffect, useCallback } from 'react';
import { cls } from './types';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showControls?: boolean;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, autoPlay = false, interval = 5000, showDots = true, showControls = true, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const count = React.Children.count(children);

    const next = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, [count]);

    const prev = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + count) % count);
    }, [count]);

    useEffect(() => {
      if (!autoPlay) return;
      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }, [autoPlay, interval, next]);

    return (
      <div ref={ref} className={cls('av-carousel', className)} {...props}>
        <div className="av-carousel__viewport" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {React.Children.map(children, (child) => (
            <div className="av-carousel__slide">{child}</div>
          ))}
        </div>

        {showControls && (
          <>
            <button className="av-carousel__control av-carousel__control--prev" onClick={prev} aria-label="Previous slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="av-carousel__control av-carousel__control--next" onClick={next} aria-label="Next slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </>
        )}

        {showDots && (
          <div className="av-carousel__dots">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                className="av-carousel__dot"
                data-active={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = 'Carousel';
