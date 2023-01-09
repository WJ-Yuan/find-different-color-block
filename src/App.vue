<script setup lang="ts">
import { ref, nextTick, onMounted, watch, onBeforeUnmount } from "vue";
import failSound from "./assets/sound/fail.wav";
import successSound from "./assets/sound/success.wav";

type StateType = "wait" | "run" | "finish";
type ColorType = [string, string];

const n = ref<number>(1);
const step = ref<number>(0);
const I = ref<number>(0);
const state = ref<StateType>("wait");
const time = ref<number>(30);

let t: any = null;

const startGame = () => {
  state.value = "run";
  startTimer();
};

const resetGame = () => {
  step.value = 0;
  n.value = 1;
  I.value = 0;
  state.value = "wait";
  time.value = 30;
  stepChange();
};

const randomIntNumber = (n: number): number => {
  return Math.floor(Math.random() * n);
};

const randomDiffRto = (): number => {
  if (step.value <= 3) {
    // 0.4 - 0.5之间的随机数
    return (Math.random() * 1 + 4) / 10;
  } else if (step.value <= 12) {
    // 0.5 - 0.7之间的随机数
    return (Math.random() * 2 + 5) / 10;
  } else if (step.value <= 18) {
    // 0.7 - 0.8之间的随机数
    return (Math.random() * 1 + 7) / 10;
  } else {
    // 0.8 - 0.85之间的随机数
    return 0.8 + Math.random() / 20;
  }
};

const randomColor = (): ColorType => {
  const color1 = randomIntNumber(255);
  const color2 = randomIntNumber(255);
  const color3 = randomIntNumber(255);
  if (color1 === 255 && color2 === 255 && color3 === 255) {
    return randomColor();
  }
  const baseColor = `rgb(${color1}, ${color2}, ${color3})`;
  const diffColor = `rgba(${color1}, ${color2}, ${color3}, ${randomDiffRto()})`;
  return [baseColor, diffColor];
};

const randomDiffIndex = (i: number): number => {
  return Math.floor(Math.random() * i);
};

const resetColor = (number: number): void => {
  const [baseColor, diffColor] = randomColor();
  const r = Math.random();

  document.documentElement.style.setProperty("--number", `${number}`);
  number > 10 && document.documentElement.style.setProperty("--gap", "5px");
  const box = document.querySelectorAll(".item-box");

  box.forEach((html) => {
    (html as HTMLDivElement).style.setProperty(
      "background-color",
      r > 0.5 ? baseColor : diffColor
    );
  });
  (box[I.value] as HTMLDivElement).style.setProperty(
    "background-color",
    r > 0.5 ? diffColor : baseColor
  );
};

const stepChange = () => {
  clearTimer();
  step.value++;
  n.value = step.value < 20 ? Math.pow(step.value + 1, 2) : 400;
  const number = step.value < 20 ? step.value + 1 : 20;
  I.value = randomDiffIndex(n.value);
  nextTick(() => {
    resetColor(number);
  });
};

type SoundMap = {
  success: string;
  fail: string;
};

const Sound: SoundMap = {
  success: successSound,
  fail: failSound,
};

// 音频处理
const playSound = (type: keyof typeof Sound) => {
  const sound = document.createElement("audio");
  sound.src = Sound[type];
  sound.play();
};

const selectDiffColor = (index: number) => {
  if (state.value === "run" && index === I.value) {
    playSound("success");
    stepChange();
    startTimer();
  } else if (state.value === "run" && index !== I.value) {
    playSound("fail");
  }
};

const startTimer = () => {
  time.value--;
  t = setTimeout(startTimer, 1000);
};

const clearTimer = () => {
  clearTimeout(t);
  t = null;
};

onMounted(() => {
  stepChange();
});

watch(time, (val, _) => {
  if (val === 0) {
    clearTimer();
    state.value = "finish";
  }
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<template>
  <div class="step-info">第{{ step }}关</div>
  <div class="challenge-handle">
    <span>00:00:{{ time < 10 ? `0${time}` : time }}</span>
    <button v-if="state === 'wait'" title="开始" @click="startGame">
      START
    </button>
    <button v-if="state === 'finish'" title="重置" @click="resetGame">
      RESET
    </button>
  </div>
  <div class="grid-box">
    <div
      v-for="i in n"
      :key="i + 'index'"
      class="item-box"
      @click="selectDiffColor(i - 1)"
    ></div>
  </div>
</template>

<style scoped>
.challenge-handle {
  display: flex;
  justify-content: space-between;
  width: 400px;
  margin: 10px 0;
  line-height: 32px;
  height: 30px;
  vertical-align: middle;
  font-size: 24px;
}
button {
  height: 32px;
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
  font-weight: 600;
  font-size: 24px;
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
</style>
