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
