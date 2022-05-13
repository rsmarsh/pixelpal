export const getElementFromCoords = (x: number, y: number) => {
  const element = document.elementFromPoint(x, y) as HTMLElement;
  return element;
};
