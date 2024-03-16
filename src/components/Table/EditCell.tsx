import { MouseEvent } from 'react'
import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const EditCell = ({ row, column, table }: any) => {
  const meta = table.options.meta

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(column)
    console.log(meta?.editedRows)
    const elName = e.currentTarget.name
    // meta?.setEditedRows((old: []) => ({
    //   ...old,
    //   [row.id]: !old[row.id]
    // }))
    // if (elName !== 'edit') {
    //   meta?.revertData(row.index, e.currentTarget.name === 'cancel')
    // }
  }

  const removeRow = () => {
    meta?.removeRow(row.index)
  }

  return (
    <div className='edit-cell-container'>
      {meta?.editedRows[row.id] ? (
        <Space className='wh_table_edit_cell-action'>
          {/* <Button size='small' onClick={setEditedRows} name='cancel' icon={<CloseOutlined />} /> */}
          <Button size='small' onClick={setEditedRows} name='done' icon={<CheckOutlined />} />
        </Space>
      ) : (
        <Space className='wh_table_edit_cell-action'>
          {/* <Button size='small' onClick={setEditedRows} name='edit' icon={<EditOutlined />} /> */}
          <Button size='small' onClick={removeRow} name='edit' icon={<DeleteOutlined />} />
        </Space>
      )}
      {/* <Input type='checkbox' checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /> */}
    </div>
  )
}

export default EditCell
