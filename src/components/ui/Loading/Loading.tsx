import React from 'react';
import './Loading.css';

export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  message?: string;
  overlay?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  overlay = false,
  className = ''
}) => {
  const wrapperClasses = [
    'loading-wrapper',
    overlay && 'loading-wrapper--overlay',
    className
  ].filter(Boolean).join(' ');

  const loadingClasses = [
    'loading',
    `loading--${variant}`,
    `loading--${size}`
  ].filter(Boolean).join(' ');

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={loadingClasses}>
            <div className="loading__dot"></div>
            <div className="loading__dot"></div>
            <div className="loading__dot"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={loadingClasses}>
            <div className="loading__pulse"></div>
          </div>
        );
      
      case 'skeleton':
        return (
          <div className={loadingClasses}>
            <div className="loading__skeleton-line loading__skeleton-line--title"></div>
            <div className="loading__skeleton-line loading__skeleton-line--text"></div>
            <div className="loading__skeleton-line loading__skeleton-line--text"></div>
          </div>
        );
      
      default: // spinner
        return (
          <div className={loadingClasses}>
            <svg className="loading__spinner" viewBox="0 0 24 24">
              <circle
                className="loading__spinner-track"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="2"
              />
              <circle
                className="loading__spinner-progress"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={wrapperClasses}>
      {renderLoader()}
      {message && (
        <p className="loading__message">
          {message}
        </p>
      )}
    </div>
  );
};
