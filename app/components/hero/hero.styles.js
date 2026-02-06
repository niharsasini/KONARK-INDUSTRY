export const HeroStyles = () => (
  <style jsx>{`
    /* ================= FLOAT ================= */
    @keyframes float {
      0% {
        transform: translateY(0) scale(1);
      }
      50% {
        transform: translateY(-10px) scale(1.02);
      }
      100% {
        transform: translateY(0) scale(1);
      }
    }

    .animate-float {
      animation: float 4.5s ease-in-out infinite;
      will-change: transform;
    }

    /* ================= FADE UP ================= */
    @keyframes fadeUp {
      0% {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    .animate-fadeUp {
      opacity: 0;
      animation: fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      will-change: opacity, transform;
    }

    .animate-fadeUp.delay-100 {
      animation-delay: 0.1s;
    }
    .animate-fadeUp.delay-200 {
      animation-delay: 0.2s;
    }
    .animate-fadeUp.delay-300 {
      animation-delay: 0.3s;
    }
    .animate-fadeUp.delay-400 {
      animation-delay: 0.4s;
    }
    .animate-fadeUp.delay-500 {
      animation-delay: 0.5s;
    }

    /* ================= ACCESSIBILITY ================= */
    @media (prefers-reduced-motion: reduce) {
      .animate-float,
      .animate-fadeUp {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `}</style>
);
