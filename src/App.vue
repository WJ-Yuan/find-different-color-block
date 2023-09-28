<script setup lang="ts">
import { ref, nextTick, onMounted, watch, onBeforeUnmount } from 'vue';
import { State, GameStatus, GameMode } from './constants';
import { useSound, useRandomColor, useMode } from '@/composables';

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
  n.value = step.value < 20 ? Math.pow(step.value + 1, 2) : 400;
  const number = step.value < 20 ? step.value + 1 : 20;
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
  <div v-if="mode === GameMode.NULL">
    <div class="step-info" style="margin-bottom: 40px">请选择挑战模式</div>
    <div style="text-align: center; max-width: 400px">
      <button @click="changeMode(GameMode.ENDLESS)">无尽模式</button>
    </div>
    <div style="text-align: center; margin-top: 20px; max-width: 400px">
      <button @click="changeMode(GameMode.CHALLENGE)">挑战模式</button>
    </div>
  </div>
  <div v-show="mode !== GameMode.NULL">
    <div class="step-info">第{{ step }}关</div>
    <div class="challenge-handle">
      <span>
        <span v-if="mode === GameMode.CHALLENGE" class="time">00:00:{{ time < 10 ? `0${time}` : time }}</span>
      </span>
      <span style="height: 32px; line-height: 32px; display: inline-flex; justify-content: flex-end">
        <span v-show="state === State.WAIT" title="开始" @click="startGame">
          <img style="width: 32px; height: 32px" src="/src/assets/icon/play.svg" />
        </span>
        <span v-show="state === State.FINISH" title="重置" @click="resetGame">
          <img style="width: 32px; height: 32px" src="/src/assets/icon/reset.svg" />
        </span>
        <span style="margin-left: 8px" title="退出" @click="quitGame">
          <img style="width: 32px; height: 32px" src="/src/assets/icon/quit.svg" />
        </span>
        <span style="height: 32px; line-height: 32px; margin-left: 8px" @click="changeSilent(!isSilent)">
          <img v-show="isSilent" style="width: 32px; height: 32px" title="静音" src="/src/assets/icon/silent.svg" />
          <img v-show="!isSilent" style="width: 32px; height: 32px" title="声音" src="/src/assets/icon/sound.svg" />
        </span>
      </span>
    </div>

    <div class="grid-box">
      <div v-for="i in n" :key="i + 'index'" class="item-box" @click="selectDiffColor(i - 1)"></div>
    </div>
  </div>
</template>

<style scoped>
#app {
  text-align: center;
  cursor: pointer;
}
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
button {
  height: 32px;
  width: calc(100% - 100px);
  min-width: 100px;
  border: none;
  background-color: rgb(255, 182, 98);
  border-radius: 5px;
  color: #ffffff;
  font-weight: 600;
}
.step-info {
  width: 400px;
  text-align: center;
  margin: 10px 0;
  font-weight: 800;
  font-size: 24px;
  color: #ffb662;
  animation: infinite ease-in 0.5s shrink;
}

.time {
  color: #ffb662;
  font-weight: 700;
  animation: infinite ease-in 0.5s shrink;
}

@keyframes shrink {
  0% {
    text-shadow: #fff 1px 0 10px;
  }

  100% {
    text-shadow: #ecf908 1px 0 10px;
  }
}

.grid-box {
  width: 400px;
  height: 400px;
  display: grid;
  grid-gap: var(--gap);
  grid-template-columns: repeat(var(--number), 1fr);
  grid-template-rows: repeat(var(--number), 1fr);
}

.item-box {
  background-color: var(--background-color);
}

@media screen and (max-width: 400px) {
  .challenge-handle {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .step-info {
    width: 100%;
  }

  .grid-box {
    width: 100%;
    height: 100vw;
  }
}
</style>
