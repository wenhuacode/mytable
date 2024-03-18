import { ChangeEvent, useEffect, useState, useRef, KeyboardEvent } from 'react'
import { Input, Select, DatePicker, Form } from 'antd'
import dayjs from 'dayjs'

type Option = {
  label: string
  value: string
}

const TableCell = ({ getValue, row, column, table, cell }: any) => {
  const initialValue = getValue()
  const columnMeta = column.columnDef.meta
  const tableMeta = table.options.meta
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value)
    editCellStatus()
  }

  const editCellStatus = () => {
    tableMeta?.setEditedRows((old: []) => ({
      ...old,
      [column.id + row.id]: !old[column.id + row.id]
    }))
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e)
    tableMeta?.updateData(row.index, column.id, e)
    editCellStatus()
  }
  const onDatePickerChange = (date: any) => {
    setValue(dayjs(date).format('YYYY-MM-DD'))
    tableMeta?.updateData(row.index, column.id, dayjs(date).format('YYYY-MM-DD'))
    editCellStatus()
  }

  const getNewCellID = (e: string, cell: any) => {
    let cell_id
    let new_column_id
    let status = true
    // 分割cell_id
    const [row_id, column_id] = cell?.id.split('_')

    const columns: string[] = []
    table.getAllColumns().map((item: any) => {
      columns.push(item.id)
    })

    switch (e) {
      case 'ArrowUp':
        cell_id = (Number(row_id) - 1).toString()
        if (cell_id === '-1') {
          cell_id = row_id
        }
        new_column_id = column_id
        break
      case 'ArrowDown':
        cell_id = (Number(row_id) + 1).toString()
        if (Number(cell_id) >= table.getRowModel().rows.length) {
          cell_id = row_id
        }
        new_column_id = column_id
        break
      case 'ArrowLeft':
        cell_id = row_id
        new_column_id = columns[columns.indexOf(column_id) - 1]
        if (columns.indexOf(column_id) - 1 <= 1) {
          new_column_id = column_id
        }
        break
      case 'ArrowRight':
        cell_id = row_id
        new_column_id = columns[columns.indexOf(column_id) + 1]
        if (columns.indexOf(column_id) + 1 >= columns.length) {
          new_column_id = column_id
        }
        break
      default:
        status = false
    }

    return { cell_id, new_column_id, status }
  }

  const keyBoardChange = async (e: KeyboardEvent, cell: any) => {
    const { cell_id, new_column_id, status } = getNewCellID(e.code, cell)
    if (!status) {
      return
    }

    // 保存现在的值
    tableMeta?.updateData(row.index, column.id, value)

    // 关闭现在的
    tableMeta?.setEditedRows((old: []) => ({
      ...old,
      [column.id + row.id]: !old[column.id + row.id]
    }))

    //开启新的
    tableMeta?.setEditedRows((old: []) => ({
      ...old,
      [new_column_id + cell_id]: !old[(new_column_id + cell_id) as any]
    }))
  }

  if (tableMeta?.editedRows[column.id + row.id]) {
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
              className='wh_table_select'
              autoFocus
              onChange={onSelectChange}
              onBlur={editCellStatus}
              allowClear={true}
              defaultOpen={true}
              size='small'
              style={{ width: '100%', height: '100%' }}
              variant='borderless'
              onKeyDown={e => keyBoardChange(e, cell)}
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
              autoFocus
              allowClear={false}
              size='small'
              style={{ width: '100%', height: '100%' }}
              onChange={onDatePickerChange}
              required
              variant='borderless'
              onKeyDown={e => keyBoardChange(e, cell)}
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
              autoFocus
              placeholder='请填写信息'
              onChange={e => onInputChange(e)}
              onBlur={onBlur}
              variant='filled'
              onKeyDown={e => keyBoardChange(e, cell)}
            />
          </Form.Item>
        )
    }
  }

  return (
    <div
      className='flex justify-start items-center'
      autoFocus
      onClick={editCellStatus}
      style={{ width: '100%', height: '100%' }}
    >
      {value}
    </div>
  )
}

export default TableCell
