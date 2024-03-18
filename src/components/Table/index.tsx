import { useState } from 'react'
import { useTableNav } from '@table-nav/react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { columns } from './columns.ts'
import { defaultData } from './data.ts'
import { FooterCell } from '../Table/FooterCell'
import { Form, FormInstance } from 'antd'
import './index.css'
import dayjs from 'dayjs'

export const Table = () => {
  const [data, setData] = useState(() => [...defaultData])
  const [originalData, setOriginalData] = useState(() => [...defaultData])
  const [editedRows, setEditedRows] = useState({})

  const [form] = Form.useForm<FormInstance>()
  const { listeners } = useTableNav({ debug: false })

  const table = useReactTable({
    data,
    columns,
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

  return (
    <div>
      <div className='flex flex-col'>
        <div className='-m-1.5 overflow-x-auto'>
          <div>
            <div className='overflow-hidden'>
              <table
                {...listeners}
                cellSpacing={0}
                className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'
              >
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        return (
                          <th
                            key={header.id}
                            tabIndex={-1}
                            colSpan={header.colSpan}
                            scope='col'
                            className='px-0.1 py-2 text-start text-xs font-medium text-gray-500 uppercase'
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        )
                      })}
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
    </div>
  )
}
