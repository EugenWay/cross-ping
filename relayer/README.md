# Cross-chain Relayer

Node.js (TypeScript) сервис для релея сообщений между Vara и Ethereum.

## Структура
- `src/config.ts` — все константы и конфиги
- `src/vara.ts` — модуль для подключения к Vara и прослушивания событий
- `src/ethereum.ts` — модуль для подключения к Ethereum и прослушивания событий
- `src/index.ts` — инициализация, запуск listeners
- `.env` — приватные данные (RPC, ключи)

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` и заполните следующие переменные:
```env
VARA_RPC_URL=wss://vara-rpc.example/ws
ETHEREUM_RPC_URL=https://ethereum-holesky.example
RELAYER_PRIVATE_KEY=your-eth-private-key
ETHEREUM_MESSAGE_QUEUE_CONTRACT=0x...
ETHEREUM_RELAYER_PROXY_CONTRACT=0x...
```

## Запуск

Для разработки:
```bash
npm run dev
```

Для продакшена:
```bash
npm run build
npm start
```

## Как это работает

1. Релейер слушает сеть Vara на событие `PingSent`
2. При получении события, запрашивает `merkleProof` для `messageHash`
3. Слушает контракт RelayerProxy на Ethereum на событие `MerkleRootSubmitted`
4. Когда получен новый MerkleRoot, использует его для проверки proof
5. Вызывает `processMessage()` в MessageQueue контракте с:
   - merkleProof
   - messageHash
   - message.payload
   - to (адрес контракта-получателя)

## Безопасность

- Никогда не коммитьте файл `.env` в репозиторий
- Храните приватные ключи в безопасном месте
- Используйте разные ключи для разработки и продакшена 