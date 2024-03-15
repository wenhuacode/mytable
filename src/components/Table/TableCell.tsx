import { ChangeEvent, useEffect, useState } from 'react'
import { Input, Select, DatePicker } from 'antd'
import dayjs from 'dayjs'

type Option = {
  label: string
  value: string
}

const TableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue()
  const columnMeta = column.columnDef.meta
  const tableMeta = table.options.meta
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value)
  }

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e)
    tableMeta?.updateData(row.index, column.id, e)
  }
  const onDatePickerChange = (date: any) => {
    setValue(dayjs(date).format('YYYY-MM-DD'))
    tableMeta?.updateData(row.index, column.id, dayjs(date).format('YYYY-MM-DD'))
  }

  if (tableMeta?.editedRows[row.id]) {
    switch (columnMeta?.type) {
      case 'select':
        return (
          <Select
            style={{ width: '90%' }}
            className='wh_table_select'
            onChange={onSelectChange}
            value={initialValue}
            size='small'
          >
            {columnMeta?.options?.map((option: Option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        )
      case 'date':
        return (
          <DatePicker
            className='wh_table_date_picker'
            value={dayjs(initialValue)}
            size='small'
            onChange={onDatePickerChange}
          />
        )
      default:
        return (
          <Input
            className='wh_table_input'
            value={value}
            size='small'
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            width={10}
          />
        )
    }
  }
  return <span>{value}</span>
}

export default TableCell
