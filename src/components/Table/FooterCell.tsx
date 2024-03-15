import { Button } from 'antd'

export const FooterCell = ({ table }: any) => {
  const meta = table.options.meta
  const selectedRows = table.getSelectedRowModel().rows

  const removeRows = () => {
    meta.removeSelectedRows(table.getSelectedRowModel().rows.map(row => row.index))
    table.resetRowSelection()
  }

  return (
    <div className='footer-buttons'>
      {selectedRows.length > 0 ? (
        <Button danger size='small' className='remove-button' onClick={removeRows}>
          删除选择 -
        </Button>
      ) : null}
      <Button className='add-button' size='small' onClick={meta?.addRow} type='dashed'>
        新增一行 +
      </Button>
    </div>
  )
}
