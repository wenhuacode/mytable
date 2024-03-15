import { MouseEvent } from 'react'
import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const EditCell = ({ row, table }: any) => {
  const meta = table.options.meta

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id]
    }))
    if (elName !== 'edit') {
      meta?.revertData(row.index, e.currentTarget.name === 'cancel')
    }
  }

  const removeRow = () => {
    meta?.removeRow(row.index)
  }

  return meta?.editedRows[row.id] ? (
    <Space className='wh_table_edit_cell'>
      <Button size='small' onClick={setEditedRows} name='cancel' icon={<CloseOutlined />} />
      <Button size='small' onClick={setEditedRows} name='done' icon={<CheckOutlined />} />
    </Space>
  ) : (
    <Space className='wh_table_edit_cell'>
      <Button size='small' onClick={setEditedRows} name='edit' icon={<EditOutlined />} />
      <Button size='small' onClick={removeRow} name='edit' icon={<DeleteOutlined />} />
    </Space>
  )
}

export default EditCell
