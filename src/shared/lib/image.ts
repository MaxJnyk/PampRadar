/**
 * Проверяет, является ли URL заглушкой
 * @param url - URL изображения
 * @returns true если это заглушка
 */
export const isPlaceholderImage = (url: string | undefined): boolean => {
  if (!url) return true;
  
  return (
    url.includes('empty.gif') ||
    url.includes('placeholder') ||
    url === '/images/empty.gif'
  );
};

/**
 * Преобразует относительный URL в абсолютный
 * @param url - URL изображения
 * @param baseUrl - базовый URL
 * @returns полный URL или undefined для заглушек
 */
export const normalizeImageUrl = (
  url: string | undefined,
  baseUrl: string = 'https://launch.meme'
): string | undefined => {
  if (!url || isPlaceholderImage(url)) {
    return undefined;
  }
  
  return url.startsWith('/') ? `${baseUrl}${url}` : url;
};
