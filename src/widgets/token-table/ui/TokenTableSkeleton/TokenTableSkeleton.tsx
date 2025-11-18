import React from 'react';
import { Skeleton, SkeletonAvatar } from '../../../../shared/ui/Skeleton/Skeleton';
import './TokenTableSkeleton.css';

/**
 * Скелетон для одной строки таблицы токенов
 * Точная копия структуры реальной строки
 */
const TokenRowSkeleton: React.FC = () => {
  return (
    <tr className="token-row-skeleton">
      {/* Token Cell - аватарка + название/символ + время */}
      <td className="skeleton-cell" style={{ width: '320px', maxWidth: '320px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <SkeletonAvatar size={40} />
            <Skeleton width="35px" height="10px" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="140px" height="16px" />
            <Skeleton width="90px" height="14px" />
          </div>
        </div>
      </td>

      {/* CA Cell */}
      <td className="skeleton-cell">
        <Skeleton width="90px" height="16px" />
      </td>

      {/* Volume Cell */}
      <td className="skeleton-cell">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Skeleton width="70px" height="18px" />
          <Skeleton width="55px" height="14px" />
        </div>
      </td>

      {/* Market Cap Cell */}
      <td className="skeleton-cell">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Skeleton width="75px" height="18px" />
          <Skeleton width="65px" height="14px" />
        </div>
      </td>

      {/* Progress Cell */}
      <td className="skeleton-cell">
        <Skeleton width="100%" height="20px" borderRadius="10px" />
      </td>

      {/* Holders Cell */}
      <td className="skeleton-cell">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton width="55px" height="18px" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Skeleton width="80px" height="22px" borderRadius="4px" />
            <Skeleton width="80px" height="22px" borderRadius="4px" />
          </div>
        </div>
      </td>

      {/* Trade Cell */}
      <td className="skeleton-cell">
        <Skeleton width="90px" height="34px" borderRadius="6px" />
      </td>
    </tr>
  );
};

/**
 * Скелетон для всей таблицы токенов
 * Показывается во время загрузки компонента
 */
export const TokenTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="token-table-skeleton">
      <table className="data-table">
        <thead className="data-table-header">
          <tr>
            <th className="data-table-head">TOKEN</th>
            <th className="data-table-head">CA</th>
            <th className="data-table-head">VOLUME</th>
            <th className="data-table-head">MARKET CAP</th>
            <th className="data-table-head">PROGRESS</th>
            <th className="data-table-head">HOLDERS</th>
            <th className="data-table-head">TRADE</th>
          </tr>
        </thead>
        <tbody className="data-table-body">
          {Array.from({ length: rows }).map((_, index) => (
            <TokenRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
