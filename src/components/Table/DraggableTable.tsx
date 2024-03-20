import { CSSProperties } from 'react'

import { flexRender, ColumnResizeMode, Header, Cell, Table } from '@tanstack/react-table'
import { type DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FormInstance } from 'antd'
import { HolderOutlined } from '@ant-design/icons'
import { OrderCenter } from './columns'
import { changeRowData } from './util'

const DraggableTableHeader = ({
  header,
  table,
  columnResizeMode
}: {
  header: Header<any, unknown>
  table: any
  columnResizeMode: ColumnResizeMode
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0
  }

  return (
    <th
      {...{
        key: header.id,
        colSpan: header.colSpan,
        style: {
          width: header.getSize()
        }
      }}
      key={header.id}
      colSpan={header.colSpan}
      ref={setNodeRef}
      scope='col'
      style={style}
      className='px-0.1 py-2 text-start text-sm font-medium text-gray-500 uppercase'
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      <div
        {...{
          onDoubleClick: () => header.column.resetSize(),
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${table.options.columnResizeDirection} ${
            header.column.getIsResizing() ? 'isResizing' : ''
          }`,
          style: {
            transform:
              columnResizeMode === 'onEnd' && header.column.getIsResizing()
                ? `translateX(${
                    (table.options.columnResizeDirection === 'rtl' ? -1 : 1) *
                    (table.getState().columnSizingInfo.deltaOffset ?? 0)
                  }px)`
                : ''
          }
        }}
      />
      <HolderOutlined {...attributes} {...listeners} style={{ marginLeft: '5px' }} /> {/*拖拽图标*/}
    </th>
  )
}

const DragAlongCell = ({
  cell,
  setEditedRows,
  row,
  form,
  table
}: {
  cell: Cell<any, unknown>
  setEditedRows: any
  row: any
  form: FormInstance
  table: any
}) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.2s ease-in-out',
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0
  }

  return (
    <td
      {...{
        key: cell.id,
        style: {
          width: cell.column.getSize()
        }
      }}
      style={style}
      ref={setNodeRef}
      key={cell.id}
      role='gridcell'
      tabIndex={-1}
      className='px-0.1 py-0.0  text-sm  text-gray-800 dark:text-gray-200'
      onKeyDown={e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
          // 判断开启或者关闭
          if (table.options.meta?.editedRows[cell.column.id + row.id]) {
            //校验产品栏是否存在值
            if (cell.row.getValue('productName') !== undefined && cell.column.id !== 'productName') {
              const tableMeta: any = table.options.meta
              const cellvalue = form.getFieldValue(cell.column.id + row.id)
              if (cellvalue) {
                //校验表单值是否合法
                //将表单的值更新
                // tableMeta.updateData(row.index, cell.column.id, cellvalue)
                changeRowData(tableMeta, cell, cellvalue)
              } else {
                return
              }
            } else {
              form.resetFields()
            }
          }

          setEditedRows((old: []) => ({
            ...old,
            [cell.column.id + row.id]: !old[(cell.column.id + row.id) as any]
          }))
        }
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  )
}

export { DraggableTableHeader, DragAlongCell }

// 列拖拽排序
export function handleDragEnd(event: DragEndEvent, setColumnOrder: any) {
  const { active, over } = event
  if (active && over && active.id !== over.id) {
    setColumnOrder((columnOrder: any) => {
      const oldIndex = columnOrder.indexOf(active.id as string)
      const newIndex = columnOrder.indexOf(over.id as string)
      return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
    })
  }
}
