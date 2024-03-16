import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Input, Select, DatePicker, Form, FormInstance } from 'antd'
import type { InputRef } from 'antd'
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
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
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
          <Form.Item
            style={{ margin: 0 }}
            name={`${column.id + row.id}`}
            initialValue={value}
            rules={[{ required: true, message: `` }]}
            noStyle={true}
          >
            <Select
              style={{ width: '95%' }}
              className='wh_table_select'
              onChange={onSelectChange}
              value={initialValue}
              allowClear={true}
              size='small'
            >
              {columnMeta?.options?.map((option: Option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )
      case 'date':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={`${column.id + row.id}`}
            initialValue={initialValue !== 'Invalid Date' ? dayjs(initialValue) : undefined}
            rules={[{ required: true, message: `` }]}
            noStyle={true}
          >
            <DatePicker
              className='wh_table_date_picker'
              style={{ width: '95%' }}
              value={initialValue !== 'Invalid Date' ? dayjs(initialValue) : undefined}
              size='small'
              onChange={onDatePickerChange}
              required
            />
          </Form.Item>
        )
      default:
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={`${column.id + row.id}`}
            initialValue={value}
            rules={[{ required: true, message: `` }]}
            noStyle={true}
          >
            <Input
              className='wh_table_input'
              size='small'
              ref={inputRef}
              value={value}
              placeholder='请填写信息'
              onChange={e => onInputChange(e)}
              onBlur={onBlur}
              style={{ width: '95%' }}
            />
          </Form.Item>
        )
    }
  }

  return (
    <span
      className='wh_table_span'
      onClick={() => {
        tableMeta?.setEditedRows((old: []) => ({
          ...old,
          [row.id]: !old[row.id]
        }))
      }}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
    >
      {value}
    </span>
  )
}

export default TableCell
