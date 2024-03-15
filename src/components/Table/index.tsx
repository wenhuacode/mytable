import { useState } from 'react'
import './table.css'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { columns } from './columns.ts'
import { defaultData } from './data.ts'
import { FooterCell } from '../Table/FooterCell'
import { Form } from 'antd'

export const Table = () => {
  const [data, setData] = useState(() => [...defaultData])
  const [originalData, setOriginalData] = useState(() => [...defaultData])
  const [editedRows, setEditedRows] = useState({})

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
          dateOfBirth: undefined,
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
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: any[]) => old.filter((_row, index) => !selectedRows.includes(index))
        setData(setFilterFunc)
        setOriginalData(setFilterFunc)
      }
    }
  })
  return (
    <>
      <Form>
        <table className='wh_table'>
          <thead className='wh_table_thead'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr className='wh_table_tr' key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th className='wh_table_th' key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='wh_table_tbody'>
            {table.getRowModel().rows.map(row => (
              <tr className='wh_table_tr' key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    className='wh_table_td'
                    key={cell.id}
                    style={{
                      width: cell.column.getSize()
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
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
      </Form>
      <pre>{JSON.stringify(data, null, '\t')}</pre>
    </>
  )
}
