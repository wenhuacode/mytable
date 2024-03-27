import * as React from 'react'
import usestyles from './index.style'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return <th ref={ref} className={styles.head} {...props} />
  }
)
TableHead.displayName = 'TableHead'

export default TableHead
