<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import type { Plugin } from 'chart.js'
import type { Project } from '@/types'
import { ProjectStatus } from '@/types'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface Props { projects: Project[] }

const props = defineProps<Props>()
const { t } = useI18n()

const active = computed(() => props.projects.filter((p) => p.status === ProjectStatus.Active).length)
const archived = computed(() => props.projects.filter((p) => p.status === ProjectStatus.Archived).length)
const totalTasks = computed(() => props.projects.reduce((s, p) => s + p.taskCount, 0))

const topProjects = computed(() =>
  [...props.projects]
    .sort((a, b) => b.taskCount - a.taskCount)
    .slice(0, 6),
)

const tooltipDefaults = {
  backgroundColor: 'rgba(22, 23, 28, 0.96)',
  borderColor: 'rgba(204, 145, 102, 0.25)',
  borderWidth: 1,
  titleColor: '#e2e3e9',
  bodyColor: '#9194a1',
  padding: 10,
  cornerRadius: 6,
}

const centerPlugin = markRaw<Plugin<'doughnut'>>({
  id: 'doughnutCenter',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart

    if (!chartArea) {
      return
    }

    const cx = (chartArea.left + chartArea.right) / 2
    const cy = (chartArea.top + chartArea.bottom) / 2

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = '700 18px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#e2e3e9'
    ctx.fillText(String(props.projects.length), cx, cy - 7)

    ctx.font = '400 11px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#777a88'
    ctx.fillText(t('stats.projects'), cx, cy + 9)

    ctx.restore()
  },
})

const doughnutData = computed(() => ({
  labels: [t('stats.active'), t('stats.archived')],
  datasets: [
    {
      data: [active.value, archived.value],
      backgroundColor: ['#cc9166', '#2e3038'],
      borderColor: ['#cc9166', '#464853'],
      borderWidth: 1.5,
      hoverOffset: 6,
    },
  ],
}))

const doughnutOptions = markRaw({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  layout: { padding: 8 },
  plugins: {
    legend: { display: false },
    tooltip: {
      ...tooltipDefaults,
      callbacks: {
        label: (ctx: { label: string; raw: unknown }) => ` ${ctx.label}: ${ctx.raw}`,
      },
    },
  },
})

const barData = computed(() => ({
  labels: topProjects.value.map((p) =>
    p.name.length > 16 ? p.name.slice(0, 14) + '…' : p.name,
  ),
  datasets: [
    {
      data: topProjects.value.map((p) => p.taskCount),
      backgroundColor: topProjects.value.map((p) =>
        p.status === ProjectStatus.Active
          ? 'rgba(204, 145, 102, 0.55)'
          : 'rgba(70, 72, 83, 0.55)',
      ),
      borderColor: topProjects.value.map((p) =>
        p.status === ProjectStatus.Active ? '#cc9166' : '#464853',
      ),
      borderWidth: 1,
      borderRadius: 2,
    },
  ],
}))

const barOptions = markRaw({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      ...tooltipDefaults,
      callbacks: {
        label: (ctx: { raw: unknown }) => ` ${ctx.raw} завдань`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(46, 48, 56, 0.5)' },
      ticks: {
        color: '#777a88',
        font: { size: 10 },
      },
      border: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: {
        color: '#9194a1',
        font: { size: 10 },
      },
      border: { display: false },
    },
  },
})
</script>

<template>
  <div class="stats">
    <div class="stats__doughnut">
      <div class="stats__chart">
        <Doughnut
          :key="`chart-${active}-${archived}-${projects.length}`"
          :data="doughnutData"
          :options="doughnutOptions"
          :plugins="[centerPlugin]"
        />
      </div>
      <div class="stats__legend">
        <div class="stats__row">
          <span class="stats__dot stats__dot--active" />
          <span class="stats__text">{{ t('stats.active') }} <strong class="stats__num tnum">{{ active }}</strong></span>
        </div>
        <div class="stats__row">
          <span class="stats__dot stats__dot--archived" />
          <span class="stats__text">{{ t('stats.archived') }} <strong class="tnum">{{ archived }}</strong></span>
        </div>
        <div class="stats__divider" />
        <div class="stats__row">
          <span class="stats__text stats__text--muted">{{ t('stats.totalTasks') }} <strong class="stats__num tnum">{{ totalTasks }}</strong></span>
        </div>
      </div>
    </div>

    <div
      v-if="topProjects.length"
      class="stats__bar"
      :style="{ height: topProjects.length * 26 + 24 + 'px' }"
    >
      <Bar
        :key="`bar-${projects.length}-${totalTasks}`"
        :data="barData"
        :options="barOptions"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-20);

  &__doughnut {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-24);
  }

  &__bar {
    width: 100%;
    min-height: 50px;
  }

  &__chart {
    position: relative;
    width: 110px;
    height: 110px;
    flex-shrink: 0;
  }

  &__legend {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-10);
  }

  &__row {
    display: flex;
    align-items: center;
    gap: var(--spacing-8);
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &--active {
      background: var(--color-ember-gold);
    }

    &--archived {
      background: var(--color-iron);
      border: 1px solid var(--color-steel);
    }
  }

  &__text {
    font-size: var(--text-caption);
    color: var(--color-pearl);

    &__num {
      color: var(--color-bone);
      font-weight: var(--font-weight-semibold);
    }

    &--muted {
      color: var(--color-ash);
    }
  }

  &__divider {
    height: 1px;
    background: var(--color-iron);
  }
}
</style>
