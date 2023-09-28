import { GameMode } from '@/constants';
import { ref } from 'vue';

export const useMode = () => {
  const mode = ref<GameMode>(GameMode.NULL);

  const changeMode = (_mode: GameMode) => {
    mode.value = _mode;
  };

  return {
    mode,
    changeMode,
  };
};
