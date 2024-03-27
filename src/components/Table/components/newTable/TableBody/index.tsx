import * as React from 'react'
import usestyles from './index.style'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()
    return <tbody ref={ref} className={styles.tbody} {...props} />
  }
)
TableBody.displayName = 'TableBody'

export default TableBody
