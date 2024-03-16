import { Card, ConfigProvider } from 'antd'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { Table } from '@/components/Table'
import 'dayjs/locale/zh-cn'

function App() {
  return (
    <ConfigProvider locale={locale}>
      <Table />
    </ConfigProvider>
  )
}

export default App
