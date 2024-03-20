import { MouseEvent } from 'react'
import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined, CheckOutlined, CopyOutlined } from '@ant-design/icons'

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

  const removeRow = () => {
    tableMeta?.removeRow(row.index)
  }

  const copyRow = () => {
    tableMeta?.copyRow(row.index)
  }

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {tableMeta?.editedRows[row.id] ? (
        <span>
          {/* <Button size='small' onClick={setEditedRows} name='cancel' icon={<CloseOutlined />} /> */}
          <Button size='small' onClick={setEditedRows} name='done' icon={<CheckOutlined />} />
        </span>
      ) : (
        <span style={{ whiteSpace: 'nowrap' }}>
          {/* <Button size='small' onClick={setEditedRows} name='edit' icon={<EditOutlined />} /> */}
          <Button
            size='small'
            onClick={removeRow}
            name='copy'
            style={{ marginRight: '5px' }}
            icon={<DeleteOutlined />}
          />
          <Button size='small' onClick={copyRow} name='edit' icon={<CopyOutlined />} />
        </span>
      )}
      {/* <Input type='checkbox' checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} /> */}
    </span>
  )
}

export default EditCell
