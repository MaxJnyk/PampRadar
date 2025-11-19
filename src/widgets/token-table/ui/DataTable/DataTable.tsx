"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import React from "react";
import "./DataTable.css";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Показываем только первые 1000 токенов (фиксированное количество)
  const VISIBLE_ROWS = 1000;
  const visibleData = (data as any[]).slice(0, VISIBLE_ROWS);
  
  // Используем реальные данные, без пустых placeholder строк
  const tableData = React.useMemo(() => {
    return visibleData;
  }, [visibleData]);
  
  const [columnSizing, setColumnSizing] = React.useState({});
  
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Важно для live обновлений - отключаем все автоматические сбросы
    autoResetAll: false,
    autoResetPageIndex: false,
    autoResetExpanded: false,
    enableRowSelection: false,
    // Используем индекс как ключ - так строки не перестраиваются
    getRowId: (row: any, index: number) => `row-${index}`,
    // Фиксируем размеры колонок
    state: {
      columnSizing,
    },
    onColumnSizingChange: setColumnSizing,
  });

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead className="data-table-header">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="data-table-head"
                  style={{
                    cursor: "default",
                    width: header.getSize() !== 150 ? header.getSize() : undefined,
                    maxWidth: header.column.columnDef.maxSize,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="data-table-body">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className="data-table-row"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <td 
                    key={cell.id} 
                    className="data-table-cell"
                    style={{
                      width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined,
                      maxWidth: cell.column.columnDef.maxSize,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="data-table-empty"
              >
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
