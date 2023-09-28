export const useRandomColor = () => {
  type ColorType = [string, string];

  const randomDiffRto = (step: number): number => {
    if (step <= 3) {
      // 0.4 - 0.5之间的随机数
      return (Math.random() * 1 + 4) / 10;
    } else if (step <= 12) {
      // 0.5 - 0.7之间的随机数
      return (Math.random() * 2 + 5) / 10;
    } else if (step <= 18) {
      // 0.7 - 0.8之间的随机数
      return (Math.random() * 1 + 7) / 10;
    } else {
      // 0.8 - 0.85之间的随机数
      return 0.8 + Math.random() / 20;
    }
  };

  const randomIntNumber = (n: number): number => {
    return Math.floor(Math.random() * n);
  };

  const randomColor = (step: number): ColorType => {
    const color1 = randomIntNumber(255);
    const color2 = randomIntNumber(255);
    const color3 = randomIntNumber(255);
    if (color1 === 255 && color2 === 255 && color3 === 255) {
      return randomColor(step);
    }
    const baseColor = `rgb(${color1}, ${color2}, ${color3})`;
    const diffColor = `rgba(${color1}, ${color2}, ${color3}, ${randomDiffRto(step)})`;
    return [baseColor, diffColor];
  };

  return {
    randomColor,
  };
};
