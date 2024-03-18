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
    id: 'no',
    header: '',
    cell: ({ row, table }) =>
      (table.getSortedRowModel()?.flatRows?.findIndex(flatRow => flatRow.id === row.id) || 0) + 1,
    size: 30
  }),

  columnHelper.display({
    id: 'edit',
    header: '操作',
    cell: EditCell,
    size: 60
  }),

  columnHelper.accessor('studentId', {
    header: 'ID',
    cell: TableCell,
    meta: {
      type: 'number'
    },
    enableResizing: false,
    size: 150
  }),

  columnHelper.accessor('name', {
    id: 'name',
    header: '全名',
    cell: TableCell,
    meta: {
      type: 'text',
      required: true,
      pattern: '^[a-zA-Z ]+$'
    },
    size: 320
  }),

  columnHelper.accessor('dateOfBirth', {
    id: 'dateOfBirth',
    header: '生日',
    cell: TableCell,
    meta: {
      type: 'date',
      required: true
    },
    size: 320
  }),

  columnHelper.accessor('major', {
    id: 'major',
    header: '属性',
    cell: TableCell,
    meta: {
      type: 'select',
      required: true,
      options: [
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Business', label: 'Business' },
        { value: 'Psychology', label: 'Psychology' }
      ]
    },
    size: 300
  })
]
