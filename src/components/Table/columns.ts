import { createColumnHelper } from '@tanstack/react-table'
import TableCell from './TableCell'
import EditCell from './EditCell'
import { formattedNum } from './util'

type OrderCenter = {
  productName?: string
  barcode?: string
  qty?: number
  price?: number
  total?: number
  discount?: number
  discountPrice?: number
  discountTotal?: number
  giveaway?: number
  box?: number
  boxRule?: number
  note?: string
}

const columnHelper = createColumnHelper<OrderCenter>()

export const columns = [
  columnHelper.display({
    id: 'no',
    header: '',
    cell: ({ row, table }) =>
      (table.getSortedRowModel()?.flatRows?.findIndex(flatRow => flatRow.id === row.id) || 0) + 1,
    footer: '合计',
    size: 30
  }),

  columnHelper.display({
    id: 'edit',
    header: '操作',
    cell: EditCell,
    size: 60
  }),

  columnHelper.accessor('productName', {
    id: 'productName',
    header: '产品名称',
    cell: TableCell,
    meta: {
      type: 'model',
      edit: true,
      required: true
    },
    size: 300
  }),

  columnHelper.accessor('barcode', {
    id: 'barcode',
    header: '条码',
    cell: TableCell,
    meta: {
      type: 'text',
      edit: false
    },
    size: 100
  }),

  columnHelper.accessor('qty', {
    id: 'qty',
    header: '数量',
    cell: TableCell,
    meta: {
      type: 'interger',
      edit: true,
      is_float: false, //TODO 从配置读取文件。 判断是否开启小数
      required: true
    },
    size: 40,
    footer: ({ table }) =>
      table.getFilteredRowModel().rows.reduce((total, row) => total + formattedNum(row.getValue('qty')), 0)
  }),

  columnHelper.accessor('price', {
    id: 'price',
    header: '单价',
    cell: TableCell,
    meta: {
      type: 'number',
      edit: false
    },
    size: 40
  }),

  columnHelper.accessor('total', {
    id: 'total',
    header: '金额',
    cell: TableCell,
    meta: {
      type: 'number',
      edit: false
    },

    size: 40
  }),

  columnHelper.accessor('discount', {
    id: 'discount',
    header: '折扣',
    cell: TableCell,
    meta: {
      type: 'number',
      num_max: 1,
      edit: true,
      required: true
    },
    size: 40
  }),

  columnHelper.accessor('discountPrice', {
    id: 'discountPrice',
    header: '折后单价',
    cell: TableCell,
    meta: {
      type: 'number',
      edit: true,
      required: true
    },
    size: 40
  }),

  columnHelper.accessor('discountTotal', {
    id: 'discountTotal',
    header: '折后金额',
    cell: TableCell,
    meta: {
      type: 'number',
      edit: true,
      required: true
    },
    footer: ({ table }) =>
      table.getFilteredRowModel().rows.reduce((total, row) => total + formattedNum(row.getValue('discountTotal')), 0),
    size: 40
  }),

  columnHelper.accessor('giveaway', {
    id: 'giveaway',
    header: '赠品',
    cell: TableCell,
    meta: {
      type: 'number',
      edit: true,
      required: true
    },
    size: 40
  }),

  columnHelper.accessor('box', {
    id: 'box',
    header: '箱',
    cell: TableCell,
    meta: {
      type: 'text',
      edit: false
    },
    size: 40
  }),

  columnHelper.accessor('boxRule', {
    id: 'boxRule',
    header: '箱规',
    cell: TableCell,
    meta: {
      type: 'text',
      edit: false
    },
    size: 40
  }),

  columnHelper.accessor('note', {
    id: 'note',
    header: '备注',
    cell: TableCell,
    meta: {
      type: 'input',
      edit: true
    },
    size: 60
  })
]
