import React, { useState, Suspense, useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useIonViewWillEnter } from '@ionic/react';
import { Header } from '../../../widgets/header';
import { TokenSearch } from '../../../features/token-search';
import { useTokens } from '../../../entities/token/model/useTokens';
import { useTokensLoader } from '../../../entities/token/model/useTokensLoader';
import { useTokenUpdatesHandler } from '../../../entities/token/model/useTokenUpdatesHandler';
import { websocketWorker } from '../../../shared/api/websocketWorker';
import { useTokenFilter } from '../../../features/token-search/model/useTokenFilter';
import { useDebounce } from '../../../shared/hooks';
import { lazyWithRetry } from '../../../shared/lib';
import { TokenTableSkeleton } from '../../../widgets/token-table/ui/TokenTableSkeleton';
import './Terminal.css';

// Lazy loading для тяжелого компонента таблицы
const TokenTable = lazyWithRetry(
  () => import('../../../widgets/token-table').then(module => ({ default: module.TokenTable })),
  { retries: 3, delay: 1000 }
);

/**
 * Главная страница приложения - терминал для мониторинга токенов
 * Отображает таблицу токенов с live-обновлениями и поиском
 */
const Terminal: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  
  // Debounce для оптимизации поиска (300ms задержка)
  const debouncedSearchText = useDebounce(searchText, 300);
  
  // Управление состоянием токенов
  const { tokens, loading, setLoading, updateToken, addNewToken, setAllTokens } = useTokens();

  // Загрузка начальных данных
  const { loadTokens } = useTokensLoader(setAllTokens, setLoading);

  // Перезагружаем данные при каждом возврате на страницу
  useIonViewWillEnter(() => {
    loadTokens();
  });

  const { handleLiveUpdate, handleNewToken } = useTokenUpdatesHandler({
    updateToken,
    addNewToken,
  });

  useEffect(() => {
    const unsubscribe = websocketWorker.subscribe(
      (mint: string, data: any) => {
        handleLiveUpdate(mint, data);
      },
      (data: any) => {
        handleNewToken(data);
      }
    );

    return unsubscribe;
  }, [handleLiveUpdate, handleNewToken]);

  const filteredTokens = useTokenFilter(tokens, debouncedSearchText);

  return (
    <IonPage>
      <Header />
      
      <IonContent className="terminal-content">
        <div className="terminal-container">
          <TokenSearch value={searchText} onChange={setSearchText} />
          
          {loading ? (
            <TokenTableSkeleton rows={10} />
          ) : (
            <Suspense fallback={<TokenTableSkeleton rows={10} />}>
              <TokenTable tokens={filteredTokens} loading={loading} />
            </Suspense>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Terminal;
