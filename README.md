## Что Сделано

### 1. Real-time Мониторинг Токенов
- WebSocket подключение к https://launch.meme/docs/#/ в отдельном Web Worker
- Таблица токенов с real time обновлениями 
- Нет моков - все данные реальные с API

### 2. Создание Токенов на Solana
- Форма создания токена с валидацией (Zod)
- Загрузка изображений в IPFS через Pinata
- Создание реальных SPL токенов на Solana devnet
- Аутентификация через Privy (email)
- Автоматическое создание Solana кошелька из email
- Success модалка с адресом токена и транзакцией

## Технологии

**Frontend**: React 18.2, TypeScript, Ionic 7.x, Capacitor 7.4

**Blockchain**: @solana/web3.js, @solana/spl-token, Privy Auth

**IPFS**: Pinata

**Real-time**: Web Worker + WebSocket

## Как Запустить

```bash
npm install  yarn
npm start     yarn
```

Environment Variables (.env):
```
REACT_APP_PINATA_API_KEY=297ac84014e20b289b2b
REACT_APP_PINATA_SECRET_KEY=9983f852c7c98e6f7063c19db3a600bfed3e77a74f9c7fbbaaf675f62cff16fc
```

## Что Работает

✅ Real-time Web Worker ws мониторинг (без моков)
✅ Таблица с живыми данными
✅ Создание реальных SPL токенов на Solana
✅ IPFS загрузка изображений и метаданных
✅ Privy аутентификация - из либы, которую вы линканули для базы
✅ Автоматический Solana кошелек из email

## Как Проверить Flow

### 1. Real-time Мониторинг
1. Открой приложение
2. На главной странице увидишь таблицу токенов
3. Цены обновляются в реальном времени через Web Worker
4. Новые токены появляются автоматически

### 2. Создание Токена
1. Нажми **CREATE** в header - Без логина не получиться, нужен кошельёк что бы создать, так что сразу свыполняем вход.
2. Залогинься через email (Privy)
3. После логина автоматически создастся Solana кошелек
4. Заполни форму:
   - **Name**: название токена
   - **Ticker**: символ (автоматически uppercase)
   - **Description**: описание (опционально)
   - **Image**: загрузи картинку (drag & drop)
   - **Social links**: Twitter, Telegram, Discord, Website (опционально)
5. Нажми **Create meme**
6. Подожди:
   - Загрузка изображения в IPFS (~2-3 сек)
   - Загрузка метаданных в IPFS (~1-2 сек)
   - Создание SPL токена на Solana (~3-5 сек)
7. Увидишь Success Modal с:
   - Token Address (можно скопировать)
   - Transaction Signature (можно скопировать)
   - Ссылки на Solana Explorer

### 3. Проверка Токена
1. Скопируй Token Address из Success Modal
2. Открой https://explorer.solana.com/?cluster=devnet
3. Вставь адрес в поиск
4. Увидишь созданный токен с:
   - Supply: 1,000,000,000
   - Decimals: 9
   - Mint Authority: твой кошелек

## Пример Созданного Токена

https://explorer.solana.com/address/2E8Wx1Q7vKDXzM3u8c4xTFLFSiCU5MEWtyzJT291hoXY?cluster=devnet

