import * as React from 'react'
import usestyles from './index.style'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return <tfoot ref={ref} className={styles.tfoot} {...props} />
  }
)
TableFooter.displayName = 'TableFooter'

export default TableFooter
