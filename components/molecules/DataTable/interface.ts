export interface Column<T> {
  header: string | React.ReactNode
  accessor: keyof T | string
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
  tableClassName?: string
  rowClassName?: string | ((item: T) => string)
  renderSubRow?: (item: T) => React.ReactNode
}