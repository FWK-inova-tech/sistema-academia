import React from 'react';
import './Table.css';
import { Button } from '../Button/Button';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  onClick: (row: any) => void;
  icon?: React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  actions,
  loading = false,
  emptyMessage = "Nenhum registro encontrado",
  className = ''
}) => {
  const tableClasses = [
    'table-container',
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={tableClasses}>
        <div className="table-loading">
          <div className="table-skeleton">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="table-skeleton-row">
                {columns.map((_, j) => (
                  <div key={j} className="table-skeleton-cell"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={tableClasses}>
        <div className="table-empty">
          <div className="table-empty-icon">📋</div>
          <p className="table-empty-message">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={tableClasses}>
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table-header-cell table-header-cell--${column.align || 'left'}`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="table-header-cell table-header-cell--center">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="table-body">
            {data.map((row, index) => (
              <tr key={index} className="table-row">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`table-cell table-cell--${column.align || 'left'}`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="table-cell table-cell--center">
                    <div className="table-actions">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || 'secondary'}
                          size="sm"
                          onClick={() => action.onClick(row)}
                          leftIcon={action.icon}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
