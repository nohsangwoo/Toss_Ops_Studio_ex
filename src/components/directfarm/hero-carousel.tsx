"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function DirectFarmHeroCarousel({ slides }: { slides: readonly string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      {slides.map((slide, index) => (
        <Image
          key={slide}
          src={slide}
          alt={`DirectFarm 무인 주문 키오스크 ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className={`object-cover transition duration-700 ease-out ${
            index === activeIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur">
        {slides.map((slide, index) => (
          <button
            key={slide}
            type="button"
            aria-label={`${index + 1}번 히어로 이미지 보기`}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-[#ff385c]" : "w-2 bg-neutral-300"
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
