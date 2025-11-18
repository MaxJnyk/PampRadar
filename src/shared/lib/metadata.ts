/**
 * Кеш для метаданных токенов
 */
const metadataCache = new Map<string, any>();

/**
 * Загружает метаданные токена из IPFS
 * @param metadataUri - URI метаданных (IPFS или HTTP)
 * @returns Метаданные токена или null
 */
export const fetchTokenMetadata = async (metadataUri: string): Promise<any | null> => {
  if (!metadataUri) return null;
  
  // Проверяем кеш
  if (metadataCache.has(metadataUri)) {
    return metadataCache.get(metadataUri);
  }
  
  try {
    const response = await fetch(metadataUri, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const metadata = await response.json();
    
    // Кешируем результат
    metadataCache.set(metadataUri, metadata);
    
    return metadata;
  } catch (error) {
    return null;
  }
};

/**
 * Извлекает URL изображения из метаданных
 * @param metadata - Метаданные токена
 * @returns URL изображения или undefined
 */
export const getImageFromMetadata = (metadata: any): string | undefined => {
  if (!metadata) return undefined;
  
  // Стандартные поля для изображения в метаданных NFT
  return metadata.image || metadata.icon || metadata.logo || metadata.imageUrl;
};

/**
 * Загружает изображение токена из метаданных
 * @param metadataUri - URI метаданных
 * @returns URL изображения или undefined
 */
export const fetchTokenImage = async (metadataUri: string): Promise<string | undefined> => {
  const metadata = await fetchTokenMetadata(metadataUri);
  return getImageFromMetadata(metadata);
};
