import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  CheckSquare,
  Square,
  Minus
} from 'lucide-react';
import { Column, TableAction, PaginationInfo, SortInfo, SortOrder } from '../../types';
import './DataTable.css';

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: Partial<PaginationInfo>;
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  exportable?: boolean;
  actions?: TableAction<T>[];
  className?: string;
  style?: React.CSSProperties;
  emptyText?: string;
  loadingText?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  onSelectionChange?: (selectedRows: T[], selectedRowKeys: (string | number)[]) => void;
  onSortChange?: (sortInfo: SortInfo | null) => void;
  onSearch?: (searchTerm: string) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onExport?: (format: 'csv' | 'excel', data: T[]) => void;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

function DataTable<T = any>({
  data,
  columns,
  loading = false,
  pagination,
  sortable = true,
  searchable = true,
  filterable = false,
  selectable = false,
  exportable = true,
  actions = [],
  className = '',
  style,
  emptyText = 'No data available',
  loadingText = 'Loading...',
  rowKey = 'id',
  onSelectionChange,
  onSortChange,
  onSearch,
  onPageChange,
  onExport,
  size = 'md',
  bordered = true,
  striped = true,
  hoverable = true
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortInfo, setSortInfo] = useState<SortInfo | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(pagination?.current || 1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const tableRef = useRef<HTMLDivElement>(null);

  // Get row key function
  const getRowKey = useCallback((record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  }, [rowKey]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    return data.filter(record => {
      return columns.some(column => {
        const value = record[column.key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortInfo) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortInfo.field];
      const bVal = b[sortInfo.field];
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortInfo.order === 'asc' ? -1 : 1;
      if (bVal == null) return sortInfo.order === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortInfo.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortInfo.order === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortInfo.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortInfo]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    onSearch?.(value);
  }, [onSearch]);

  // Handle sort
  const handleSort = useCallback((field: string) => {
    const column = columns.find(col => col.key === field);
    if (!column?.sortable) return;

    let newOrder: SortOrder = 'asc';
    if (sortInfo?.field === field) {
      newOrder = sortInfo.order === 'asc' ? 'desc' : sortInfo.order === 'desc' ? null : 'asc';
    }

    const newSortInfo = newOrder ? { field, order: newOrder } : null;
    setSortInfo(newSortInfo);
    onSortChange?.(newSortInfo);
  }, [columns, sortInfo, onSortChange]);

  // Handle row selection
  const handleRowSelect = useCallback((record: T, checked: boolean) => {
    const key = getRowKey(record, 0);
    let newSelectedKeys;
    
    if (checked) {
      newSelectedKeys = [...selectedRowKeys, key];
    } else {
      newSelectedKeys = selectedRowKeys.filter(k => k !== key);
    }
    
    setSelectedRowKeys(newSelectedKeys);
    
    const selectedRows = data.filter(item => {
      const itemKey = getRowKey(item, 0);
      return newSelectedKeys.includes(itemKey);
    });
    
    onSelectionChange?.(selectedRows, newSelectedKeys);
  }, [selectedRowKeys, data, getRowKey, onSelectionChange]);

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    let newSelectedKeys: (string | number)[] = [];
    
    if (checked) {
      newSelectedKeys = paginatedData.map((record, index) => getRowKey(record, index));
    }
    
    setSelectedRowKeys(newSelectedKeys);
    
    const selectedRows = checked ? [...paginatedData] : [];
    onSelectionChange?.(selectedRows, newSelectedKeys);
  }, [paginatedData, getRowKey, onSelectionChange]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onPageChange?.(page, pageSize);
  }, [pageSize, onPageChange]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    onPageChange?.(1, newPageSize);
  }, [onPageChange]);

  // Handle export
  const handleExport = useCallback((format: 'csv' | 'excel') => {
    if (onExport) {
      onExport(format, sortedData);
    } else {
      // Default CSV export
      if (format === 'csv') {
        const headers = columns.map(col => col.title).join(',');
        const rows = sortedData.map(record => 
          columns.map(col => {
            const value = record[col.key];
            return `"${String(value || '').replace(/"/g, '""')}"`;
          }).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }, [onExport, sortedData, columns]);

  // Check if all rows are selected
  const allSelected = paginatedData.length > 0 && selectedRowKeys.length === paginatedData.length;
  const someSelected = selectedRowKeys.length > 0 && selectedRowKeys.length < paginatedData.length;

  // Pagination info
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Build CSS classes
  const tableClasses = [
    'data-table',
    `data-table--${size}`,
    bordered && 'data-table--bordered',
    striped && 'data-table--striped',
    hoverable && 'data-table--hoverable',
    loading && 'data-table--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={tableClasses} style={style} ref={tableRef}>
      {/* Toolbar */}
      {(searchable || filterable || exportable) && (
        <div className="data-table__toolbar">
          <div className="data-table__toolbar-left">
            {searchable && (
              <div className="data-table__search">
                <div className="data-table__search-wrapper">
                  <Search className="data-table__search-icon" size={16} />
                  <input
                    type="text"
                    className="data-table__search-input"
                    placeholder="Search table..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {filterable && (
              <button className="data-table__filter-button">
                <SlidersHorizontal size={16} />
                Filters
              </button>
            )}
          </div>
          
          <div className="data-table__toolbar-right">
            {exportable && (
              <div className="data-table__export">
                <button
                  className="data-table__export-button"
                  onClick={() => handleExport('csv')}
                  title="Export as CSV"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selection info */}
      {selectable && selectedRowKeys.length > 0 && (
        <div className="data-table__selection-info">
          <div className="data-table__selection-count">
            {selectedRowKeys.length} row(s) selected
          </div>
          <button
            className="data-table__clear-selection"
            onClick={() => {
              setSelectedRowKeys([]);
              onSelectionChange?.([], []);
            }}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table wrapper */}
      <div className="data-table__wrapper">
        <table className="data-table__table">
          <thead className="data-table__header">
            <tr className="data-table__header-row">
              {selectable && (
                <th className="data-table__header-cell data-table__header-cell--selection">
                  <div className="data-table__checkbox-wrapper">
                    <button
                      className="data-table__checkbox"
                      onClick={() => handleSelectAll(!allSelected)}
                      aria-label={allSelected ? 'Deselect all' : 'Select all'}
                    >
                      {allSelected ? (
                        <CheckSquare size={16} />
                      ) : someSelected ? (
                        <Minus size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </div>
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className={`data-table__header-cell ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  <div className="data-table__header-cell-content">
                    <span className="data-table__header-title">{column.title}</span>
                    {sortable && column.sortable !== false && (
                      <button
                        className="data-table__sort-button"
                        onClick={() => handleSort(String(column.key))}
                        aria-label={`Sort by ${column.title}`}
                      >
                        <div className="data-table__sort-icons">
                          <ChevronUp
                            className={`data-table__sort-icon ${
                              sortInfo?.field === column.key && sortInfo.order === 'asc'
                                ? 'data-table__sort-icon--active'
                                : ''
                            }`}
                            size={12}
                          />
                          <ChevronDown
                            className={`data-table__sort-icon ${
                              sortInfo?.field === column.key && sortInfo.order === 'desc'
                                ? 'data-table__sort-icon--active'
                                : ''
                            }`}
                            size={12}
                          />
                        </div>
                      </button>
                    )}
                  </div>
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="data-table__header-cell data-table__header-cell--actions">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="data-table__body">
            {loading ? (
              <tr className="data-table__loading-row">
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="data-table__loading-cell"
                >
                  <div className="data-table__loading-content">
                    <div className="data-table__loading-spinner" />
                    {loadingText}
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr className="data-table__empty-row">
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="data-table__empty-cell"
                >
                  <div className="data-table__empty-content">
                    {emptyText}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRowKeys.includes(key);
                
                return (
                  <tr
                    key={key}
                    className={`data-table__row ${isSelected ? 'data-table__row--selected' : ''}`}
                  >
                    {selectable && (
                      <td className="data-table__cell data-table__cell--selection">
                        <div className="data-table__checkbox-wrapper">
                          <button
                            className="data-table__checkbox"
                            onClick={() => handleRowSelect(record, !isSelected)}
                            aria-label={`${isSelected ? 'Deselect' : 'Select'} row`}
                          >
                            {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                          </button>
                        </div>
                      </td>
                    )}
                    
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`data-table__cell ${column.className || ''}`}
                      >
                        <div className="data-table__cell-content">
                          {column.render 
                            ? column.render(record[column.key], record)
                            : String(record[column.key] || '')
                          }
                        </div>
                      </td>
                    ))}
                    
                    {actions.length > 0 && (
                      <td className="data-table__cell data-table__cell--actions">
                        <div className="data-table__actions">
                          {actions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              className={`data-table__action-button ${action.className || ''}`}
                              onClick={() => action.onClick(record)}
                              disabled={action.disabled?.(record)}
                              title={action.label}
                            >
                              {action.icon || <MoreHorizontal size={16} />}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalItems > 0 && (
        <div className="data-table__pagination">
          <div className="data-table__pagination-info">
            {pagination.showTotal?.(totalItems, [startItem, endItem]) ||
              `Showing ${startItem}-${endItem} of ${totalItems} items`
            }
          </div>
          
          <div className="data-table__pagination-controls">
            {pagination.showSizeChanger !== false && (
              <div className="data-table__page-size">
                <select
                  className="data-table__page-size-select"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>
            )}
            
            <div className="data-table__page-navigation">
              <button
                className="data-table__page-button"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              
              <button
                className="data-table__page-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="data-table__page-info">
                {pagination.showQuickJumper ? (
                  <div className="data-table__quick-jumper">
                    Page
                    <input
                      type="number"
                      className="data-table__page-input"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = Number(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }}
                    />
                    of {totalPages}
                  </div>
                ) : (
                  <span className="data-table__page-current">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>
              
              <button
                className="data-table__page-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
              
              <button
                className="data-table__page-button"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;