import { ChangeEvent, useEffect, useState, useRef, KeyboardEvent } from 'react'
import { Input, Select, Form, InputNumber } from 'antd'
import dayjs from 'dayjs'
import { Cell } from '@tanstack/react-table'
import { getNewCellID, limitDecimal, limitDecimalPoint, priceFilterNoNum, priceFilterPointNoNum } from './util'

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

  const onProductClick = (e: any, cell: Cell<any, any>) => {
    tableMeta.setSelectProductShow(!tableMeta.selectProductShow)
  }

  // 判断产品是否已经录入
  const productStatus = () => {
    return cell.row.getValue('productName') !== undefined
  }

  const intergerOnBule = () => {
    if (productStatus()) {
      tableMeta?.updateData(row.index, column.id, value)
    } else {
      // 清除form 值
      tableMeta.form.resetFields()
    }
    editCellStatus()
  }

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

  const keyBoardChange = async (e: KeyboardEvent, cell: any) => {
    const { cell_id, new_column_id, status } = getNewCellID(e.code, cell, table)
    if (!status) {
      return
    }

    if (cell.getValue() !== value) {
      // 保存现在的值
      tableMeta?.updateData(row.index, column.id, value)
    }

    // 关闭现在的 和开启新的
    tableMeta?.setEditedRows((old: []) => ({
      ...old,
      [column.id + row.id]: !old[column.id + row.id],
      [new_column_id + cell_id]: !old[(new_column_id + cell_id) as any]
    }))
  }

  if (tableMeta?.editedRows[column.id + row.id] && columnMeta.edit) {
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

      case 'model':
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
              onClick={e => onProductClick(e, cell)}
              // onChange={e => onInputChange(e)}
              onBlur={onBlur}
              variant='filled'
              onKeyDown={e => keyBoardChange(e, cell)}
            />
          </Form.Item>
        )

      case 'interger':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={`${column.id + row.id}`}
            initialValue={initialValue}
            rules={[
              { required: true, message: `` },
              { pattern: /^[0-9]+$/, message: '' }
            ]}
            noStyle={true}
          >
            <InputNumber
              className='wh_table_date_picker'
              autoFocus
              size='small'
              style={{ width: '100%', height: '100%' }}
              onChange={e => {
                productStatus() ? setValue(e) : undefined
              }}
              required
              min={0}
              step={1}
              stringMode
              formatter={value => limitDecimalPoint(value)}
              parser={value => priceFilterPointNoNum(value)}
              controls={false}
              onBlur={intergerOnBule}
              // variant='filled'
              onKeyDown={e => keyBoardChange(e, cell)}
            />
          </Form.Item>
        )

      case 'number':
        return (
          <Form.Item
            style={{ margin: 0 }}
            name={`${column.id + row.id}`}
            initialValue={initialValue}
            rules={[
              { required: true, message: `` }
              // { pattern: /^[0-9]+$/, message: '' }
            ]}
            noStyle={true}
          >
            <InputNumber
              className='wh_table_date_picker'
              autoFocus
              size='small'
              style={{ width: '100%', height: '100%' }}
              onChange={e => setValue(e)}
              required
              min={0}
              max={columnMeta.num_max ? 1 : undefined}
              stringMode
              formatter={limitDecimal}
              parser={priceFilterNoNum}
              controls={false}
              onBlur={onBlur}
              // variant='filled'
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
