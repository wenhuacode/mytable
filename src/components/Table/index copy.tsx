import { CSSProperties, useState } from 'react'
import { useTableNav } from '@table-nav/react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  ColumnResizeDirection,
  Header,
  Cell
} from '@tanstack/react-table'
import { columns } from './columns.ts'
import { defaultData } from './data.ts'
import { FooterCell } from '../Table/FooterCell'
import { Button, Form, FormInstance } from 'antd'

// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import './index.css'
import dayjs from 'dayjs'
import React from 'react'

const DraggableTableHeader = ({
  header,
  table,
  columnResizeMode
}: {
  header: Header<any, unknown>
  table: any
  columnResizeMode: any
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
      className='px-0.1 py-2 text-start text-xs font-medium text-gray-500 uppercase'
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
      <Button {...attributes} {...listeners}>
        🟰
      </Button>
    </th>
  )
}

const DragAlongCell = ({ cell }: { cell: Cell<any, unknown> }) => {
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
    <td style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  )
}

export const WhTable = () => {
  const [data, setData] = useState(() => [...defaultData])
  const [originalData, setOriginalData] = useState(() => [...defaultData])
  const [editedRows, setEditedRows] = useState({})

  const [form] = Form.useForm<FormInstance>()
  const { listeners } = useTableNav({ debug: false })

  // 拖拽拉伸功能区块
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>('onChange')
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>('ltr')

  // 列拖拽排序
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map(c => c.id!))

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      enableRowSelection: true,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData(old => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)))
        } else {
          setOriginalData(old => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)))
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value
              }
            }
            return row
          })
        )
      },
      addRow: () => {
        const newRow: any = {
          studentId: '',
          name: '',
          dateOfBirth: dayjs().format('YYYY-MM-DD'),
          major: ''
        }
        const setFunc = (old: any[]) => [...old, newRow]
        setData(setFunc)
        setOriginalData(setFunc)
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: any[]) => old.filter((_row: any, index: number) => index !== rowIndex)
        setData(setFilterFunc)
        setOriginalData(setFilterFunc)
        form.resetFields() //清除form 内容
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: any[]) => old.filter((_row, index) => !selectedRows.includes(index))
        setData(setFilterFunc)
        setOriginalData(setFilterFunc)
        form.resetFields() //清除form 内容
      }
    }
  })

  // 列拖拽排序
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string)
        const newIndex = columnOrder.indexOf(over.id as string)
        return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
      })
    }
  }

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className='flex flex-col'>
        <div className='-m-1.5 overflow-x-auto'>
          <div>
            <div className='overflow-hidden'>
              <table
                {...listeners}
                {...{
                  style: {
                    width: table.getCenterTotalSize()
                  }
                }}
                cellSpacing={0}
                className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'
              >
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                        {headerGroup.headers.map(header => {
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
                              tabIndex={-1}
                              colSpan={header.colSpan}
                              scope='col'
                              className='px-0.1 py-2 text-start text-xs font-medium text-gray-500 uppercase'
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}

                              {/**拖拽拉伸大小功能区块 */}
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
                            </th>
                          )
                        })}
                      </SortableContext>
                    </tr>
                  ))}
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {table.getRowModel().rows.map(row => (
                    <Form form={form} key={row.id} component={false}>
                      <tr key={row.id} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                        {row.getVisibleCells().map(cell => {
                          return (
                            <td
                              {...{
                                key: cell.id,
                                style: {
                                  width: cell.column.getSize()
                                }
                              }}
                              key={cell.id}
                              role='gridcell'
                              tabIndex={-1}
                              style={{
                                width: cell.column.getSize()
                              }}
                              className='px-0.1 py-0.0  text-xs  text-gray-800 dark:text-gray-200'
                              onKeyDown={e => {
                                if (e.code === 'Enter') {
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
                        })}
                      </tr>
                    </Form>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={table.getCenterLeafColumns().length} align='left'>
                      <FooterCell table={table} />
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(data, null, '\t')}</pre>
    </DndContext>
  )
}
