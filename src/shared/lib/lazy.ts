import { ComponentType, lazy } from 'react';

/**
 * Retry конфигурация для lazy loading
 */
interface RetryConfig {
  retries?: number;
  delay?: number;
}

/**
 * Lazy loading с автоматическим retry при ошибке загрузки
 * Полезно при нестабильном соединении или CDN проблемах
 * 
 * @param importFn - функция динамического импорта
 * @param config - конфигурация retry
 * @returns lazy-loaded компонент
 * 
 * @example
 * const TokenTable = lazyWithRetry(() => import('./TokenTable'));
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: RetryConfig = {}
) => {
  const { retries = 3, delay = 1000 } = config;

  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (attemptsLeft: number) => {
        importFn()
          .then(resolve)
          .catch((error) => {
            if (attemptsLeft === 0) {
              reject(error);
              return;
            }


            setTimeout(() => {
              attemptImport(attemptsLeft - 1);
            }, delay);
          });
      };

      attemptImport(retries);
    });
  });
};

/**
 * Preload функция для критичных компонентов
 * Позволяет начать загрузку компонента до его рендера
 * 
 * @example
 * const TokenTable = lazyWithRetry(() => import('./TokenTable'));
 * // Preload при наведении на кнопку
 * <button onMouseEnter={() => preloadComponent(TokenTable)}>
 */
export const preloadComponent = (
  lazyComponent: ReturnType<typeof lazy>
) => {
  // @ts-ignore - accessing internal _payload
  const payload = lazyComponent._payload;
  if (payload && payload._status === -1) {
    payload._init(payload._result);
  }
};
