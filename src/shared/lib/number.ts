/**
 * Безопасное преобразование значения в число
 * @param value - значение для преобразования
 * @param fallback - значение по умолчанию
 * @returns число или fallback
 */
export const safeNumber = (value: unknown, fallback: number = 0): number => {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? fallback : num;
};

/**
 * Преобразует дробь в проценты
 * @param fraction - дробь от 0 до 1
 * @returns проценты от 0 до 100
 */
export const fractionToPercent = (fraction: number): number => {
  return safeNumber(fraction) * 100;
};
