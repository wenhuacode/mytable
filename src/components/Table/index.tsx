import { useState } from 'react'
import { useTableNav } from '@table-nav/react'
import {
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  ColumnResizeDirection,
  flexRender
} from '@tanstack/react-table'
import { columns } from './columns.ts'
import { defaultData } from './data.ts'
import { FooterCell } from '../Table/FooterCell'
import { Form, FormInstance, Modal } from 'antd'

// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

import './index.css'
import dayjs from 'dayjs'
import React from 'react'
import { DragAlongCell, DraggableTableHeader, handleDragEnd } from './DraggableTable.tsx'

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

  // 产品弹窗状态
  const [selectProductShow, setSelectProductShow] = useState<boolean>(false)

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder
    },
    meta: {
      editedRows,
      setEditedRows,
      enableRowSelection: true,

      // 产品添加model
      selectProductShow,
      setSelectProductShow,
      ////////////////////////////////////////////////////////////////
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

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={e => handleDragEnd(e, setColumnOrder)}
      sensors={sensors}
    >
      {/* <div className='flex flex-col'> */}
      {/* <div className='-m-1.5 overflow-x-auto'> */}
      <div className='p-2 block max-w-full  overflow-x-auto '>
        <div>
          <table
            {...listeners}
            {...{
              style: {
                width: table.getCenterTotalSize()
              }
            }}
            cellSpacing={0}
            className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 '
          >
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map(header => (
                      <DraggableTableHeader
                        key={header.id}
                        header={header}
                        table={table}
                        columnResizeMode={columnResizeMode}
                      />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {table.getRowModel().rows.map(row => (
                <Form form={form} key={row.id} component={false}>
                  <tr key={row.id} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                    {row.getVisibleCells().map(cell => (
                      <SortableContext key={cell.id} items={columnOrder} strategy={horizontalListSortingStrategy}>
                        <DragAlongCell key={cell.id} cell={cell} setEditedRows={setEditedRows} row={row} />
                      </SortableContext>
                    ))}
                  </tr>
                </Form>
              ))}
            </tbody>
            <tfoot className='px-0.1 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              {table.getFooterGroups().map((footerGroup: any) => (
                <tr key={footerGroup.id} className='text-xs text-gray-700'>
                  {footerGroup.headers.map((header: any) => (
                    <th key={header.id} colSpan={header.colSpan} className='px-0.1 py-2 text-sm text-start '>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <FooterCell table={table} />
        </div>
      </div>
      {/* </div>
      </div> */}
      {selectProductShow && (
        <Modal
          title={'选择产品'}
          open={selectProductShow}
          onCancel={() => setSelectProductShow(false)}
          onOk={() => console.log(table.options.meta)}
        />
      )}
      <pre>{JSON.stringify(data, null, '\t')}</pre>
    </DndContext>
  )
}
