<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from '@/components/common/AppNav.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AppBackground from '@/components/common/AppBackground.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
</script>

<template>
  <AppBackground />
  <div class="app-layout">
    <AppNav />
    <main class="main">
      <div class="container">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <KeepAlive include="HomeView" :max="1">
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </div>
    </main>
    <AppFooter />
  </div>
  <ToastContainer />
  <ConfirmModal />
</template>

<style lang="scss">
@use '@/styles/main';

.app-layout {
  display: flex;
  flex-direction: column;
}

.main {
  min-height: calc(100vh - var(--nav-height));
  position: relative;
}
</style>
