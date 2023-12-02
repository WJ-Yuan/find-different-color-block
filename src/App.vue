<script setup lang="ts">
import { ref, nextTick, onMounted, watch, onBeforeUnmount } from 'vue';
import { State, GameStatus, GameMode } from './constants';
import { useSound, useRandomColor, useMode } from '@/composables';
import Welcome from './components/Welcome.vue';

const { isSilent, changeSilent, playSound } = useSound();
const { randomColor } = useRandomColor();
const { mode, changeMode } = useMode();

const n = ref<number>(1);
const step = ref<number>(0);
const IBox = ref<number>(0);
const state = ref<State>(State.WAIT);
const time = ref<number>(30);

let t: unknown = null;

const startGame = () => {
  state.value = State.RUN;
  startTimer();
};

const resetGame = () => {
  step.value = 0;
  n.value = 1;
  IBox.value = 0;
  state.value = State.WAIT;
  time.value = 30;
  stepChange();
};

const quitGame = () => {
  clearTimer();
  resetGame();
  changeMode(GameMode.NULL);
  changeSilent(false);
};

const randomDiffIndex = (i: number): number => {
  return Math.floor(Math.random() * i);
};

const resetColor = (number: number): void => {
  const [baseColor, diffColor] = randomColor(step.value);
  const r = Math.random();

  document.documentElement.style.setProperty('--number', `${number}`);
  number > 10 && document.documentElement.style.setProperty('--gap', '5px');
  const box = document.querySelectorAll('.item-box');

  box.forEach((html) => {
    (html as HTMLDivElement).style.setProperty('background-color', r > 0.5 ? baseColor : diffColor);
  });
  (box[IBox.value] as HTMLDivElement).style.setProperty('background-color', r > 0.5 ? diffColor : baseColor);
};

const stepChange = () => {
  clearTimer();
  step.value++;
  const finalNum = document.body.clientWidth < 420 ? 16 : 20;
  n.value = step.value < finalNum ? Math.pow(step.value + 1, 2) : Math.pow(finalNum, 2);
  const number = step.value < finalNum ? step.value + 1 : finalNum;
  IBox.value = randomDiffIndex(n.value);
  nextTick(() => {
    resetColor(number);
  });
};

const selectDiffColor = (index: number) => {
  if (state.value === 'run' && index === IBox.value) {
    !isSilent.value && playSound(GameStatus.SUCCESS);
    stepChange();
    startTimer();
  } else if (state.value === 'run' && index !== IBox.value) {
    !isSilent.value && playSound(GameStatus.FAIL);
  }
};

const startTimer = () => {
  if (mode.value === GameMode.ENDLESS) {
    return;
  }
  time.value--;
  t = setTimeout(startTimer, 1000);
};

const clearTimer = () => {
  clearTimeout(t as undefined);
  t = null;
};

watch(time, (val, _) => {
  if (val === 0) {
    clearTimer();
    state.value = State.FINISH;
  }
});

onMounted(() => {
  stepChange();
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<template>
  <Welcome v-if="mode === GameMode.NULL" @mode-change="changeMode" />

  <div class="game-wrap" v-show="mode !== GameMode.NULL">
    <div class="step-info">第{{ step }}关</div>
    <div class="challenge-handle">
      <span class="time-wrap">
        <span v-if="mode === GameMode.CHALLENGE" class="time">00:00:{{ time < 10 ? `0${time}` : time }}</span>
      </span>
      <span class="action-wrap">
        <span v-show="state === State.WAIT" title="开始" @click="startGame">
          <img class="image" src="/src/assets/icon/play.svg" />
        </span>
        <span v-show="state === State.FINISH" title="重置" @click="resetGame">
          <img class="image" src="/src/assets/icon/reset.svg" />
        </span>
        <span class="ml-8" title="退出" @click="quitGame">
          <img class="image" src="/src/assets/icon/quit.svg" />
        </span>
        <span class="sound-action ml-8" style="" @click="changeSilent(!isSilent)">
          <img v-show="isSilent" class="image" title="静音" src="/src/assets/icon/silent.svg" />
          <img v-show="!isSilent" class="image" title="声音" src="/src/assets/icon/sound.svg" />
        </span>
      </span>
    </div>

    <div class="grid-box">
      <div v-for="i in n" :key="i + 'index'" class="item-box" @click="selectDiffColor(i - 1)"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-wrap {
  width: calc(100% - 20px);
  max-width: 420px;
  text-align: center;
  margin: auto;
  padding: 40px 10px 0;
  .challenge-handle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 400px;
    margin: 10px 0;
    line-height: 32px;
    height: 30px;
    vertical-align: middle;
    font-size: 24px;
  }

  .step-info {
    font-size: 18px;
    width: 80px;
    height: 28px;
    padding: 5px 20px;
    margin: auto;
    border-radius: 5px;
    font-weight: 600;
    color: var(--theme-color-2);
    background-color: var(--theme-color-1);
  }

  .time-wrap {
    text-align: left;

    .time {
      color: #ffb662;
      font-weight: 700;
    }
  }

  .action-wrap {
    height: 32px;
    line-height: 32px;
    display: inline-flex;
    justify-content: flex-end;

    .image {
      width: 32px !important;
      height: 32px !important;
    }

    .sound-action {
      margin-left: 8px;
    }
  }

  .grid-box {
    width: 400px;
    height: 400px;
    padding: 10px;
    border-radius: 10px;
    display: grid;
    grid-gap: var(--gap);
    grid-template-columns: repeat(var(--number), 1fr);
    grid-template-rows: repeat(var(--number), 1fr);
    background-color: var(--white);
  }

  .item-box {
    background-color: var(--background-color);
    border-radius: 0.2em;
  }

  @media screen and (max-width: 420px) {
    .challenge-handle {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .grid-box {
      width: calc(100% - 20px);
      height: calc(100vw - 20px);
    }
  }
}
</style>
