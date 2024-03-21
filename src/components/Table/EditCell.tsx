import { MouseEvent } from 'react'
import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, CopyOutlined, FileAddOutlined } from '@ant-design/icons'

const EditCell = ({ row, column, table }: any) => {
  const tableMeta = table.options.meta

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name
    // meta?.setEditedRows((old: []) => ({
    //   ...old,
    //   [row.id]: !old[row.id]
    // }))
    // if (elName !== 'edit') {
    //   meta?.revertData(row.index, e.currentTarget.name === 'cancel')
    // }
  }

  const removeRow = async () => {
    tableMeta?.removeRow(row.index)
  }

  const copyRow = async () => {
    tableMeta?.copyRow(row.index)
  }

  const addRow = async () => {
    tableMeta?.addRowIndex(row.index)
  }

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <span style={{ whiteSpace: 'nowrap' }}>
        {/* <Button size='small' onClick={setEditedRows} name='edit' icon={<EditOutlined />} /> */}
        <Button size='small' onClick={removeRow} name='copy' style={{ marginRight: '5px' }} icon={<DeleteOutlined />} />
        <Button size='small' onClick={copyRow} name='edit' icon={<CopyOutlined />} />
        <Button size='small' onClick={addRow} name='add' icon={<FileAddOutlined />} />
      </span>
      {/* <Input type='checkbox' checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /> */}
    </span>
  )
}

export default EditCell
