<template>
  <div class="bg" aria-hidden="true">
    <div class="bg__orb bg__orb--1" />
    <div class="bg__orb bg__orb--2" />
    <div class="bg__orb bg__orb--3" />
    <div class="bg__orb bg__orb--4" />
    <div class="bg__orb bg__orb--5" />
    <div class="bg__dots" />
    <div class="bg__traces" />
    <div class="bg__shimmer" />
    <div class="bg__vignette" />
  </div>
</template>

<style scoped lang="scss">
.bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #000;
  overflow: hidden;
}

.bg__orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;

  &--1 {
    width: clamp(500px, 70vw, 1000px);
    height: clamp(500px, 70vw, 1000px);
    top: -30%;
    right: -15%;
    background: radial-gradient(
      circle at 40% 40%,
      rgba(174, 147, 87, 0.13) 0%,
      rgba(204, 145, 102, 0.06) 35%,
      rgba(120, 80, 40, 0.02) 60%,
      transparent 75%
    );
    filter: blur(70px);
    animation: orb-1 24s ease-in-out infinite;
  }

  &--2 {
    width: clamp(600px, 75vw, 1100px);
    height: clamp(600px, 75vw, 1100px);
    bottom: -35%;
    left: -20%;
    background: radial-gradient(
      circle at 55% 55%,
      rgba(22, 10, 50, 0.9) 0%,
      rgba(35, 18, 70, 0.5) 40%,
      rgba(10, 5, 20, 0.2) 65%,
      transparent 80%
    );
    filter: blur(90px);
    animation: orb-2 31s ease-in-out infinite;
  }

  &--3 {
    width: clamp(280px, 30vw, 500px);
    height: clamp(280px, 30vw, 500px);
    top: 40%;
    right: 15%;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(255, 200, 130, 0.08) 0%,
      rgba(204, 145, 102, 0.05) 40%,
      transparent 70%
    );
    filter: blur(35px);
    animation: orb-3 17s ease-in-out infinite;
  }

  &--4 {
    width: clamp(400px, 50vw, 700px);
    height: clamp(400px, 50vw, 700px);
    top: -5%;
    left: 5%;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(18, 19, 23, 0.85) 0%,
      rgba(28, 29, 34, 0.4) 55%,
      transparent 80%
    );
    filter: blur(55px);
    animation: orb-4 37s ease-in-out infinite;
  }

  &--5 {
    width: clamp(300px, 35vw, 560px);
    height: clamp(300px, 35vw, 560px);
    bottom: 10%;
    right: -5%;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(174, 147, 87, 0.07) 0%,
      rgba(120, 80, 30, 0.03) 50%,
      transparent 70%
    );
    filter: blur(50px);
    animation: orb-5 20s ease-in-out infinite;
  }
}

.bg__dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(204, 145, 102, 0.35) 1px,
    transparent 1px
  );
  background-size: 40px 40px;
  opacity: 0.13;
  mask-image: radial-gradient(
    ellipse 80% 80% at 65% 40%,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    transparent 100%
  );
  animation: grid-breathe 8s ease-in-out infinite;
}

.bg__traces {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' fill='none'%3E%3Cpath d='M0 60 H48 L72 36 H120' stroke='%23cc9166' stroke-width='0.6' stroke-linecap='round'/%3E%3Cpath d='M60 0 V48 L36 72 V120' stroke='%23cc9166' stroke-width='0.6' stroke-linecap='round'/%3E%3Ccircle cx='48' cy='60' r='3' fill='none' stroke='%23cc9166' stroke-width='0.6'/%3E%3Ccircle cx='60' cy='48' r='3' fill='none' stroke='%23cc9166' stroke-width='0.6'/%3E%3Ccircle cx='0' cy='0' r='2' fill='%23cc9166' opacity='0.4'/%3E%3Ccircle cx='120' cy='120' r='2' fill='%23cc9166' opacity='0.4'/%3E%3C/svg%3E");
  background-size: 120px 120px;
  opacity: 0.04;
  mask-image: radial-gradient(
    ellipse 90% 70% at 55% 45%,
    rgba(0, 0, 0, 0.6) 0%,
    transparent 80%
  );
}

.bg__shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(174, 147, 87, 0.015) 30%,
    rgba(204, 145, 102, 0.025) 55%,
    rgba(174, 147, 87, 0.015) 75%,
    transparent 100%
  );
  animation: shimmer-rise 12s ease-in-out infinite;
}

.bg__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    transparent 30%,
    rgba(0, 0, 0, 0.4) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
}

@keyframes orb-1 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  20% {
    transform: translate3d(-5%, 8%, 0) scale(1.06);
  }
  50% {
    transform: translate3d(-9%, 3%, 0) scale(0.95);
  }
  75% {
    transform: translate3d(-3%, 10%, 0) scale(1.03);
  }
}

@keyframes orb-2 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  30% {
    transform: translate3d(7%, -6%, 0) scale(1.08);
  }
  65% {
    transform: translate3d(4%, -11%, 0) scale(0.94);
  }
}

@keyframes orb-3 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-12%, -8%, 0) scale(1.15);
  }
}

@keyframes orb-4 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  35% {
    transform: translate3d(9%, 6%, 0) scale(0.92);
  }
  70% {
    transform: translate3d(6%, 12%, 0) scale(1.05);
  }
}

@keyframes orb-5 {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  40% {
    transform: translate3d(-8%, -5%, 0) scale(1.12);
  }
  80% {
    transform: translate3d(-4%, -10%, 0) scale(0.93);
  }
}

@keyframes grid-breathe {
  0%,
  100% {
    opacity: 0.13;
  }
  50% {
    opacity: 0.19;
  }
}

@keyframes shimmer-rise {
  0% {
    transform: translateY(8%);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-5%);
    opacity: 1;
  }
  100% {
    transform: translateY(8%);
    opacity: 0.6;
  }
}
</style>
