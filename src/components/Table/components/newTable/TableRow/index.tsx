import * as React from 'react'
import usestyles from './index.style'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return <tr ref={ref} className={styles.row} {...props} />
  }
)
TableRow.displayName = 'TableRow'

export default TableRow
