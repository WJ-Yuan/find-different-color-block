import { onMounted, ref } from 'vue';
import { GameStatus } from '@/constants';

export const useSound = () => {
  const successSound = document.createElement('audio');
  const failSound = document.createElement('audio');
  const isSilent = ref<boolean>(false);

  const changeSilent = () => {
    isSilent.value = !isSilent.value;
  };

  const playSound = (type: GameStatus) => {
    let sound: HTMLAudioElement | undefined = failSound;

    if (type === GameStatus.SUCCESS) {
      sound = successSound;
      (sound as HTMLAudioElement).playbackRate = 4;
    }

    if (sound) {
      const target = sound;
      target.play();
    }
  };

  onMounted(() => {
    successSound.src = '/src/assets/sound/success.wav';
    failSound.src = '/src/assets/sound/fail.wav';
  });

  return {
    isSilent,
    changeSilent,
    playSound,
  };
};
