function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}
function stepRange(start: number, end: number, step: number): number[] {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + i * step);
}
function rangeWithSkip(start: number, end: number, skip: number[]): number[] {
  const skipSet = new Set(skip);
  return range(start, end).filter(n => !skipSet.has(n));
}
function stepRangeWithSkip(
  start: number,
  end: number,
  step: number,
  skip: number[] = []
): number[] {
  const skipSet = new Set(skip);
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => {
    const value = start + i * step;
    return Math.round(value * 100) / 100; // rounds to 2 decimal places
  }).filter((num) => !skipSet.has(num));
}
export const difficulties = {
  d1: {
    possibleNumbersByBox: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10],
      [20, 30],
      [0],
      [1, 2, 3],
      [4, 5, 6],
      [6, 7, 8, 9],
      [0],
    ],
    contasPorBox: ["+", "+", "+", "+", "+", "+", "-", "-", "-", "-"],
    possibleRandomNumbers: [6, 7, 8, 9],
  },
  d2: {
    possibleNumbersByBox: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16],
      [10, 100],
      [40, 50, 60, 70, 80],
      [0],
      [1, 2, 3],
      [4, 5, 6],
      [6, 7, 8, 9],
      [2, 3],
      [0, 1],
    ],
    contasPorBox: ["+", "+", "+ ", "+", "-", "-", "-", "-", "x", "x"],
    possibleRandomNumbers: [6, 7, 8, 9],
  },
  d3: {
    possibleNumbersByBox: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16],
      [10, 100],
      [40, 50, 60, 70, 80],
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18],
      [2],
      [0, 1],
    ],
    contasPorBox: ["+", "+", "+ ", "+", "-", "-", "-", "-", "x", "x"],
    possibleRandomNumbers: [10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
  d4: {
    possibleNumbersByBox: [
      rangeWithSkip(21,88,[30,40,50,60,70,80]),
      rangeWithSkip(101,188,[110,120,130,140,150,160,170,180]),
      [...range(191,199),...range(291,299),...range(391,399),...range(491,499)],
      range(1,10),
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18],
      [0,1],
      range(2,9),
    ],
    contasPorBox: ["+", "+", "+ ", "-", "-", "x", "x", "x", "÷", "÷"],
    possibleRandomNumbers: range(4,12),
  },
  d5: {
    possibleNumbersByBox: [
      range(7,12),
      [6, 7, 8, 9, 10, 11],
      [100, 1000],
      [3],
      [5, 6],
      [3, 6],
      [50, 60],
      [1, 2, 5],
      [2, 3, 4],
      [20, 21, 22, 23, 24],
    ],
    contasPorBox: ["x", "÷", "+", "x", "-", "÷", "x", "x", "-", "+"],
    possibleRandomNumbers: [11, 12, 13, 14],
  },
  d6: {
    possibleNumbersByBox: [
      range(22,36),
      range(157,247),
      range(22,36),
      stepRange(202,357,3),
      range(6,9),
      range(4.5,9.5),
      rangeWithSkip(21,49,[30,40]),
      range(37,216),
      range(6,36),
      [...stepRangeWithSkip(1,16,0.1,range(1,16)),0.4],
    ],
    contasPorBox: ["+", "+", "-", "-", "x", "x", "x", "÷", "÷", "÷"],
    possibleRandomNumbers: rangeWithSkip(22,36,[30]),
  },
} as const;

export type DifficultyKey = keyof typeof difficulties;
