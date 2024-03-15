import { Button } from 'antd'

export const FooterCell = ({ table }: any) => {
  const meta = table.options.meta
  return (
    <div className='footer-buttons'>
      <Button className='add-button' size='small' onClick={meta?.addRow} style={{ width: '100%' }} type='dashed'>
        新增一行
      </Button>
    </div>
  )
}
