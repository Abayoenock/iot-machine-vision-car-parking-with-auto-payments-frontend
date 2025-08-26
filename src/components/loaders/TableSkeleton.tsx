import React from "react"
import classNames from "classnames"

// Skeleton component
const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={classNames("bg-gray-200 animate-pulse", className)} />
}

// Table component
interface TableProps {
  columns: number
  rows: number
}

const TableSkeleton: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto mt-8 ">
      <table className="min-w-full border border-gray-300">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-2">
                  <Skeleton className="w-full min-h-[10px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableSkeleton
