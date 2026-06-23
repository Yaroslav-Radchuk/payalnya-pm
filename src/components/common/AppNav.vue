<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

const router = useRouter()
const { t, locale } = useI18n()

function toggle() {
  setLocale(locale.value === 'uk' ? 'en' : 'uk')
}
</script>

<template>
  <header class="nav">
    <div class="nav__inner container">
      <button class="nav__logo" @click="router.push({ name: 'home' })">
        <svg class="nav__icon" width="24" height="24" viewBox="0 0 32 32" fill="none">
          <line x1="26" y1="6" x2="18" y2="14" stroke="#cc9166" stroke-width="5" stroke-linecap="round"/>
          <line x1="24" y1="7.5" x2="25.5" y2="6" stroke="#08080a" stroke-width="1.2"/>
          <line x1="22" y1="9.5" x2="23.5" y2="8" stroke="#08080a" stroke-width="1.2"/>
          <line x1="20" y1="11.5" x2="21.5" y2="10" stroke="#08080a" stroke-width="1.2"/>
          <line x1="18" y1="14" x2="13" y2="19" stroke="#cc9166" stroke-width="2.5" stroke-linecap="butt"/>
          <line x1="13" y1="19" x2="8" y2="24" stroke="#cc9166" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="7" cy="25" r="2.2" fill="#cc9166"/>
          <circle cx="7" cy="25" r="1" fill="#fff0cc" opacity="0.5"/>
          <path d="M 11 17 Q 8.5 15 11 13" stroke="#ae9357" stroke-width="0.9" stroke-linecap="round" opacity="0.65"/>
          <path d="M 14 14 Q 11.5 12 14 10" stroke="#ae9357" stroke-width="0.9" stroke-linecap="round" opacity="0.38"/>
        </svg>
        <span class="nav__name">Паяльня</span>
        <span class="nav__badge">PM</span>
      </button>

      <div class="nav__right">
        <nav class="nav__links">
          <button class="nav__link" @click="router.push({ name: 'home' })">
            {{ t('nav.projects') }}
          </button>
        </nav>

        <div class="nav__sep" aria-hidden="true" />

        <button
          class="nav__lang"
          :aria-label="`Switch to ${t('lang.switch')}`"
          @click="toggle"
        >
          <span :class="['nav__lang-opt', { 'nav__lang-opt--active': locale === 'uk' }]">УК</span>
          <span class="nav__lang-sep">/</span>
          <span :class="['nav__lang-opt', { 'nav__lang-opt--active': locale === 'en' }]">EN</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.nav {
  position: sticky;
  top: 0;
  height: var(--nav-height);
  background: rgba(8, 8, 10, 0.88);
  backdrop-filter: blur(16px) saturate(1.4);
  border-bottom: 1px solid rgba(204, 145, 102, 0.1);
  z-index: 100;
  box-shadow: 0 1px 0 rgba(204, 145, 102, 0.06), 0 4px 24px rgba(0, 0, 0, 0.4);

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
    background: transparent;
    border: none;
    color: var(--color-paper);
    font-family: var(--font-inter);
    cursor: pointer;
    letter-spacing: -0.02em;
    padding: 0;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.82;
    }
  }

  &__icon {
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px rgba(204, 145, 102, 0.22));
    transition: filter var(--transition-base);

    .nav__logo:hover & {
      filter: drop-shadow(0 0 10px rgba(204, 145, 102, 0.45));
    }
  }

  &__name {
    font-family: var(--font-ivy-presto);
    font-size: 20px;
    font-weight: 500;
    font-style: italic;
    color: var(--color-paper);
    letter-spacing: -0.01em;
  }

  &__badge {
    font-size: var(--text-caption);
    font-weight: var(--font-weight-medium);
    color: var(--color-ash);
    background: var(--color-graphite);
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-full);
    padding: 1px 7px;
    margin-left: 2px;
    font-family: var(--font-inter);
    font-style: normal;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: var(--spacing-6);
  }

  &__links {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
  }

  &__link {
    background: transparent;
    border: none;
    color: var(--color-silver);
    font-family: var(--font-inter);
    font-size: 14px;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    padding: var(--spacing-6) var(--spacing-10);
    border-radius: var(--radius-nav);
    transition: color var(--transition-fast), background var(--transition-fast);

    &:hover {
      color: var(--color-bone);
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &__sep {
    width: 1px;
    height: 20px;
    background: var(--color-iron);
    margin-inline: var(--spacing-6);
    opacity: 0.6;
  }

  &__lang {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--color-graphite);
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-sm);
    padding: var(--spacing-6) var(--spacing-10);
    cursor: pointer;
    transition: border-color var(--transition-fast), background var(--transition-fast);
    
    &:hover {
      border-color: rgba(204, 145, 102, 0.35);
      background: rgba(204, 145, 102, 0.06);
    }
  }

  &__lang-sep {
    color: var(--color-iron);
    font-size: var(--text-caption);
    user-select: none;
  }

  &__lang-opt {
    font-family: var(--font-inter);
    font-size: var(--text-caption);
    font-weight: var(--font-weight-medium);
    color: var(--color-ash);
    transition: color var(--transition-fast);

    &--active {
      color: var(--color-ember-gold);
    }
  }
}
</style>
