<template>
  <div class="welcome-wrap">
    <div class="title">请选择挑战模式</div>
    <div class="action-wrap">
      <button class="action-button" @click="emits('modeChange', GameMode.ENDLESS)">无尽模式</button>
      <button class="action-button" @click="emits('modeChange', GameMode.CHALLENGE)">挑战模式</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GameMode } from '@/constants';

defineOptions({
  name: 'Welcome',
});

const emits = defineEmits<{
  (e: 'modeChange', mode: GameMode): void;
}>();
</script>
<style lang="scss" scoped>
.welcome-wrap {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding-top: calc(30vh - 36px);

  .title {
    height: 36px;
    width: 100%;
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    color: var(--theme-color-2);
    -webkit-text-stroke: 1px var(--theme-color-1);
    letter-spacing: 2px;
  }

  .action-wrap {
    padding: 0 32px;
    margin-top: 32px;
    .action-button {
      width: 100%;
      margin-top: 10px;
      border: none;
      height: 42px;
      line-height: 42px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 2px;
      color: var(--theme-color-2);
      background-color: var(--theme-color-1);
      border-radius: 16px;
      cursor: pointer;
    }
  }
}
</style>
