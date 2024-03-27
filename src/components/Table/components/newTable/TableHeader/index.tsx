import * as React from 'react'
import usestyles from './index.style'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return <thead ref={ref} className={styles.header} {...props} />
  }
)
TableHeader.displayName = 'TableHeader'

export default TableHeader
