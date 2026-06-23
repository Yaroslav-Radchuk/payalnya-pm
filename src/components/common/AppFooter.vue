<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__brand">
        <svg class="footer__icon" width="20" height="20" viewBox="0 0 32 32" fill="none">
          <line x1="26" y1="6" x2="18" y2="14" stroke="#cc9166" stroke-width="5" stroke-linecap="round"/>
          <line x1="24" y1="7.5" x2="25.5" y2="6" stroke="#0d0d10" stroke-width="1.2"/>
          <line x1="22" y1="9.5" x2="23.5" y2="8" stroke="#0d0d10" stroke-width="1.2"/>
          <line x1="20" y1="11.5" x2="21.5" y2="10" stroke="#0d0d10" stroke-width="1.2"/>
          <line x1="18" y1="14" x2="13" y2="19" stroke="#cc9166" stroke-width="2.5" stroke-linecap="butt"/>
          <line x1="13" y1="19" x2="8" y2="24" stroke="#cc9166" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="7" cy="25" r="2.2" fill="#cc9166"/>
          <circle cx="7" cy="25" r="1" fill="#fff0cc" opacity="0.5"/>
        </svg>
        <div class="footer__brand-text">
          <span class="footer__name">Паяльня PM</span>
          <span class="footer__tagline">{{ t('nav.tagline') }}</span>
        </div>
      </div>

      <div class="footer__stack">
        <span class="footer__stack-label">{{ t('footer.stack') }}</span>
        <div class="footer__chips">
          <span class="footer__chip">Vue 3</span>
          <span class="footer__chip">TypeScript</span>
          <span class="footer__chip">Pinia</span>
          <span class="footer__chip">Vite</span>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="container footer__copy">
        <span>© {{ year }} Паяльня PM</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  border-top: 1px solid rgba(204, 145, 102, 0.08);
  background: rgba(8, 8, 10, 0.6);
  backdrop-filter: blur(8px);
  margin-top: auto;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-32);
    padding-block: var(--spacing-24);
    flex-wrap: wrap;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-12);
  }

  &__icon {
    flex-shrink: 0;
    opacity: 0.7;
    filter: drop-shadow(0 0 4px rgba(204, 145, 102, 0.15));
  }

  &__brand-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-family: var(--font-ivy-presto);
    font-style: italic;
    font-size: 16px;
    color: var(--color-pearl);
    letter-spacing: -0.01em;
  }

  &__tagline {
    font-size: 12px;
    color: var(--color-ash);
    font-family: var(--font-inter);
  }

  &__stack {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--spacing-8);
  }

  &__stack-label {
    font-size: 11px;
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-steel);
    font-family: var(--font-inter);
  }

  &__chips {
    display: flex;
    align-items: center;
    gap: var(--spacing-6);
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__chip {
    font-family: var(--font-inter);
    font-size: 11px;
    font-weight: var(--font-weight-medium);
    color: var(--color-silver);
    background: var(--color-graphite);
    border: 1px solid var(--color-iron);
    border-radius: var(--radius-full);
    padding: 2px 9px;
    letter-spacing: 0.01em;
  }

  &__bottom {
    border-top: 1px solid var(--color-iron);
    padding-block: var(--spacing-12);
  }

  &__copy {
    display: flex;
    justify-content: center;
    font-size: 12px;
    color: var(--color-steel);
    font-family: var(--font-inter);
  }
}
</style>
