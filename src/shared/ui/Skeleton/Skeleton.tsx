import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

/**
 * Базовый компонент скелетона с анимацией
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

/**
 * Скелетон для аватарки
 */
export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius="50%"
      className="skeleton-avatar"
    />
  );
};

/**
 * Скелетон для текста с несколькими строками
 */
export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="16px"
          width={index === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};
