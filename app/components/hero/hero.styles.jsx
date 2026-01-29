export const HeroStyles = () => (
  <style jsx>{`
    @keyframes float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px) rotateZ(-1deg);
      }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }

    @keyframes fadeUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeUp {
      animation: fadeUp 1s ease forwards;
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
  `}</style>
);
