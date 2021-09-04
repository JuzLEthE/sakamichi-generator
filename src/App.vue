<template>
  <div id="app">
    <router-view class="view app-view"></router-view>
  </div>
</template>

<style>
body {
  background: #37474f;
}
.app-view {
  width: 100%;
  position: absolute;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
