import * as React from 'react'
import usestyles from './index.style'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return <td ref={ref} className={styles.cell} {...props} />
  }
)
TableCell.displayName = 'TableCell'

export default TableCell
