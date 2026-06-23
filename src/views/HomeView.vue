<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectsStore } from '@/stores/projects'
import ProjectTable from '@/components/projects/ProjectTable.vue'
import ProjectStatsChart from '@/components/projects/ProjectStatsChart.vue'
import ProjectForm from '@/components/projects/ProjectForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const store = useProjectsStore()
const showCreate = ref(false)
const { t } = useI18n()

onMounted(() => store.fetchAll())
</script>

<template>
  <div class="home">
    <div class="home__hero">
      <div class="home__hero-text">
        <h1 class="home__headline">
          {{ t('home.headlineMain') }}<br />
          <em class="home__headline--italic">{{ t('home.headlineItalic') }}</em>
        </h1>
        <p class="home__sub">{{ t('home.sub') }}</p>
      </div>
      <div v-if="store.items.length" class="home__chart">
        <ProjectStatsChart :projects="store.items" />
      </div>
    </div>

    <div class="home__section">
      <div class="home__section-head">
        <h2 class="home__section-title">{{ t('home.sectionTitle') }}</h2>
        <BaseButton variant="filled" @click="showCreate = true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ t('home.addProject') }}
        </BaseButton>
      </div>

      <div v-if="store.loading" class="home__loading">
        <div v-for="i in 4" :key="i" class="skeleton" style="height:44px;border-radius:4px;margin-bottom:8px;" />
      </div>
      <ProjectTable v-else :projects="store.items" />
    </div>

    <BaseModal v-model="showCreate" :title="t('home.newProject')">
      <ProjectForm @close="showCreate = false" />
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding-block: var(--spacing-40);

  &__hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-40);
    padding-bottom: var(--spacing-40);
    border-bottom: 1px solid var(--color-iron);
    margin-bottom: var(--spacing-40);
    flex-wrap: wrap;
  }

  &__headline {
    font-family: var(--font-ivy-presto);
    font-size: clamp(40px, 5vw, var(--text-display));
    font-weight: 400;
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
    color: var(--color-paper);
    margin-bottom: var(--spacing-16);

    &--italic {
      font-style: italic;
      color: var(--color-ember-gold);
    }
  }

  &__sub {
    font-size: var(--text-body-lg);
    color: var(--color-ash);
    max-width: 420px;
    line-height: var(--leading-body-lg);
  }

  &__section {
    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-24);
      gap: var(--spacing-16);
    }

    &-title {
      font-size: var(--text-heading-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-paper);
      letter-spacing: var(--tracking-heading-sm);
    }
  }

  &__loading {
    padding: var(--spacing-8);
  }
}
</style>
