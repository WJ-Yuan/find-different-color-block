<script setup lang="ts">
import { ref, nextTick, onMounted, watch, onBeforeUnmount } from "vue";

type stateType = "run" | "fail" | "wait";
type colorType = [string, string];

const n = ref<number>(1);
const step = ref<number>(0);
const I = ref<number>(0);
const state = ref<stateType>("wait");
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

const randomColor = (): colorType => {
  const color1 = randomIntNumber(255);
  const color2 = randomIntNumber(255);
  const color3 = randomIntNumber(255);
  if (color1 === 255 && color2 === 255 && color3 === 255) {
    return randomColor();
  }
  const baseColor = `rgb(${color1}, ${color2}, ${color3})`;
  const diffColor = `rgba(${color1}, ${color2}, ${color3}, 0.4)`;
  return [baseColor, diffColor];
};

const randomDiffIndex = (i: number): number => {
  return Math.floor(Math.random() * i);
};

const resetColor = (number: number): void => {
  const [baseColor, diffColor] = randomColor();
  document.documentElement.style.setProperty("--number", `${number}`);
  document.documentElement.style.setProperty("--background-color", baseColor);
  number > 10 && document.documentElement.style.setProperty("--gap", "5px");
  const box = document.querySelectorAll(".item-box");
  box.forEach((html) => {
    (html as HTMLDivElement).style.setProperty("background-color", baseColor);
  });
  (box[I.value] as HTMLDivElement).style.setProperty(
    "background-color",
    diffColor
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

const SelectDiffColor = (index: number) => {
  if (state.value === "run" && index === I.value) {
    stepChange();
    startTimer();
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
    state.value = "fail";
  }
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<template>
  <div class="step-info">第{{ step }}关</div>
  <div class="grid-box">
    <div
      v-for="i in n"
      :key="i + 'index'"
      class="item-box"
      @click="SelectDiffColor(i - 1)"
    ></div>
  </div>
  <button @click="startGame" v-if="state === 'wait'">开始</button>
  <span>00:00:{{ time < 10 ? `0${time}` : time }}</span>
  <button @click="resetGame" v-if="state === 'fail'">重置</button>
</template>

<style scoped>
.step-info {
  width: 400px;
  text-align: center;
  margin: 10px 0;
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
