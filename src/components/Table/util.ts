import {Table, Cell} from '@tanstack/react-table'


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
  let newNum: number
  if (isNaN(value) || value === null || value === undefined) {
    newNum = 0
  } else {
    newNum = Number(value)
  }

  return newNum
}


export   const getNewCellID = (e: string, cell: any, table: Table<any>) => {
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
      if (Number(cell_id) >= table.getRowCount()) {
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
  if (productStatus(cell)){
    
  }
  setValue(value)
}
