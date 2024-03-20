import { Table, Cell } from '@tanstack/react-table'
import Big from 'big.js'
import { OrderCenter } from './columns'

/* 设置价格限制小数位数(整数)*/
export const limitDecimalPoint = (value: any) => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '').split('.')[0]
}

/* 设置价格过滤掉非数字的输入*/
export const priceFilterPointNoNum = (value: any) => {
  return value.replace(/[^\.\d]/g, '').split('.')[0]
}

/* 设置价格限制小数位数(小数)*/
export const limitDecimal = (value: any) => {
  let reg = /^(-)*(\d+)\.(\d{0,4}).*$/
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '').replace(reg, '$1$2.$3')
}

/* 设置价格过滤掉非数字的输入(小数)*/
export const priceFilterNoNum = (value: any) => {
  let reg = /^(-)*(\d+)\.(\d{0,4}).*$/
  return value.replace(/[^\.\d]/g, '').replace(reg, '$1$2.$3')
}

/* 格式化数字*/
export const formattedNum = (value: number) => {
  let newNum: Big
  if (isNaN(value) || value === null || value === undefined) {
    newNum = new Big(0)
  } else {
    newNum = new Big(value)
  }

  return newNum
}

export const getNewCellID = (e: string, cell: any, table: Table<any>) => {
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
      const row_count: number = table.getRowCount as unknown as number
      if (Number(cell_id) >= row_count) {
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



// 判断产品是否已经录入
const productStatus = (cell: Cell<any, any>) => {
  return cell.row.getValue('productName') !== undefined
}

export const onInputNumberChange = (value: any, setValue: any, cell: Cell<any, any>, tableMeta: any) => {
  if (productStatus(cell)) {
  }
  setValue(value)
}

export const changeRowData = (tableMeta: any, cell: any, value: any) => {
  // 获取当前行的值
  const row_value = cell.row.original

  const column = cell.column
  const row = cell.row

  // 构造赠品的值
  const giveaway_val = row_value.giveaway === 1 ? new Big(0) : new Big(1)

  switch (column.id) {
    case 'qty':
      // 构造 其他单元格的值  数量 -> [ 金额 单价 折后单价 折后金额 箱 箱规]
      const qty_row: OrderCenter = {
        ...row_value,
        qty: value,
        total: Number(formattedNum(value).times(formattedNum(row_value.price))),
        discountPrice: Number(formattedNum(row_value.discountPrice).times(giveaway_val)),
        discountTotal: Number(formattedNum(value).times(formattedNum(row_value.discountPrice)).times(giveaway_val)),
        box: Number(formattedNum(value).div(formattedNum(row_value.boxRule)).toFixed(2))
      }
      if (value === 0) {
        qty_row['qty'] = 1
        qty_row['total'] = Number(formattedNum(1).times(formattedNum(row_value.price)))
        qty_row['discountPrice'] = Number(formattedNum(row_value.discountPrice).times(giveaway_val))
        qty_row['discountTotal'] = Number(
          formattedNum(1).times(formattedNum(row_value.discountPrice)).times(giveaway_val)
        )
        qty_row['box'] = Number(formattedNum(1).div(formattedNum(row_value.boxRule)).toFixed(2))
      }
      tableMeta?.updateRowData(row.index, qty_row)
      break

    case 'discount':
      // 构造 其他单元格的值  折扣 -> [ 单价 折后单价 数量 折后金额 ]
      const discount_row: OrderCenter = {
        ...row_value,
        discount: value,
        discountPrice: Number(formattedNum(value).times(formattedNum(row_value.price)).times(giveaway_val)),
        discountTotal: Number(
          formattedNum(value)
            .times(formattedNum(row_value.price))
            .times(formattedNum(row_value.qty))
            .times(giveaway_val)
        )
      }
      tableMeta?.updateRowData(row.index, discount_row)
      break

    case 'discountPrice':
      // 构造 其他单元格的值  折后单价 -> [ 数量 折后单价 折扣 折后金额 ]
      const discount_price_row: OrderCenter = {
        ...row_value,
        discountPrice: Number(formattedNum(value).times(giveaway_val)),
        discount: Number(formattedNum(value).div(formattedNum(row_value.price)).toFixed(4)),
        discountTotal: Number(formattedNum(value).times(formattedNum(row_value.qty)).times(giveaway_val))
      }
      // 判断有赠品的情况下 折扣处理
      if (giveaway_val.eq(0)) {
        discount_price_row['discount'] = 1
      }
      tableMeta?.updateRowData(row.index, discount_price_row)
      break

    case 'discountTotal':
      // 构造 其他单元格的值  折后金额 -> [ 数量 折后单价  扣 折后金额 ]
      const discount_total_row: OrderCenter = {
        ...row_value,
        discountTotal: Number(formattedNum(value).times(giveaway_val)),
        discount: Number(
          formattedNum(value).div(formattedNum(row_value.qty)).div(formattedNum(row_value.price)).toFixed(4)
        ),
        discountPrice: Number(formattedNum(value).div(formattedNum(row_value.qty)).times(giveaway_val).toFixed(4))
      }
      // 判断有赠品的情况下 折扣处理
      if (giveaway_val.eq(0)) {
        discount_total_row['discount'] = 1
      }
      tableMeta?.updateRowData(row.index, discount_total_row)
      break

    case 'giveaway':
      let giveaway_row: OrderCenter
      //区分是否赠品
      if (value === 1) {
        // 构造 其他单元格的值  赠品 -> [ 折扣 折后单价  折后金额 ]
        giveaway_row = {
          ...row_value,
          giveaway: value,
          discountTotal: 0,
          discount: 1,
          discountPrice: 0
        }
      } else {
        giveaway_row = {
          ...row_value,
          giveaway: value,
          price: row_value.price,
          total: Number(formattedNum(row_value.qty).times(row_value.price)),
          discountPrice: row_value.price,
          discountTotal: Number(formattedNum(row_value.qty).times(row_value.price)),
          discount: 1
        }
      }

      tableMeta?.updateRowData(row.index, giveaway_row)
      break
    default: {
      const row = {
        ...row_value
      }
      row[column.id] = value
      tableMeta?.updateRowData(row.index, row)
      break
    }
  }
}
