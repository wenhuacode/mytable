import { Card, ConfigProvider } from 'antd'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { TableDemo } from '@/components/test/newTable'
import 'dayjs/locale/zh-cn'

function App() {
  return (
    <ConfigProvider locale={locale}>
      <TableDemo />
    </ConfigProvider>
  )
}

export default App
