import { createColumnHelper } from '@tanstack/react-table'
import TableCell from './TableCell'
import EditCell from './EditCell'

type Student = {
  studentId: number
  name: string
  dateOfBirth: string
  major: string
}

const columnHelper = createColumnHelper<Student>()

export const columns = [
  columnHelper.display({
    header: 'no',
    cell: ({ row, table }) =>
      (table.getSortedRowModel()?.flatRows?.findIndex(flatRow => flatRow.id === row.id) || 0) + 1,
    size: 50
  }),

  columnHelper.accessor('studentId', {
    header: 'ID',
    cell: TableCell,
    meta: {
      type: 'number'
    },
    enableResizing: false,
    size: 200
  }),

  columnHelper.accessor('name', {
    id: 'name',
    header: '全名',
    cell: TableCell,
    meta: {
      type: 'text'
    },
    size: 320
  }),

  columnHelper.accessor('dateOfBirth', {
    id: 'dateOfBirth',
    header: '生日',
    cell: TableCell,
    meta: {
      type: 'date'
    },
    size: 320
  }),

  columnHelper.accessor('major', {
    id: 'major',
    header: '属性',
    cell: TableCell,
    meta: {
      type: 'select',
      options: [
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Business', label: 'Business' },
        { value: 'Psychology', label: 'Psychology' }
      ]
    },
    size: 300
  }),
  columnHelper.display({
    id: 'edit',
    header: '操作',
    cell: EditCell,
    size: 100
  })
]
