import { Card, ConfigProvider } from 'antd'
import { Table } from '@/components/Table'

function App() {
  return (
    <ConfigProvider>
      <Table />
    </ConfigProvider>
  )
}

export default App
