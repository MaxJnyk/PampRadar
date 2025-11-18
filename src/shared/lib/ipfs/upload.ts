/**
 * Сервис для загрузки файлов в IPFS
 * Использует публичный gateway для простоты
 */

const IPFS_GATEWAY = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;

/**
 * Загрузка изображения в IPFS
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    // Используем публичный IPFS gateway (nft.storage или pinata)
    // Для production нужно настроить свой API ключ
    
    // Если есть API ключи Pinata
    if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(IPFS_GATEWAY, {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const data = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    }

    // Fallback: используем nft.storage (бесплатный)
    const nftStorageResponse = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_NFT_STORAGE_KEY || ''}`,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!nftStorageResponse.ok) {
      const errorText = await nftStorageResponse.text();
      console.error('NFT.Storage error:', errorText);
      throw new Error(`Failed to upload to NFT.Storage: ${nftStorageResponse.status}`);
    }

    const nftData = await nftStorageResponse.json();
    const cid = nftData.value?.cid || nftData.cid;
    return `https://nftstorage.link/ipfs/${cid}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

/**
 * Создание метаданных токена и загрузка в IPFS
 */
export async function uploadMetadataToIPFS(metadata: {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  properties?: {
    files?: Array<{ uri: string; type: string }>;
    category?: string;
  };
}): Promise<string> {
  try {
    const metadataJson = JSON.stringify(metadata);
    const blob = new Blob([metadataJson], { type: 'application/json' });
    const file = new File([blob], 'metadata.json', { type: 'application/json' });

    // Загружаем JSON в IPFS
    if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(IPFS_GATEWAY, {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const data = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    }

    // Fallback
    const nftStorageResponse = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_NFT_STORAGE_KEY || ''}`,
      },
      body: file,
    });

    if (!nftStorageResponse.ok) {
      throw new Error('Failed to upload metadata to NFT.Storage');
    }

    const nftData = await nftStorageResponse.json();
    return `https://nftstorage.link/ipfs/${nftData.value.cid}`;
  } catch (error) {
    console.error('Metadata upload error:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}
