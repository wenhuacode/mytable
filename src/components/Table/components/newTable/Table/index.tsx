import * as React from 'react'
import usestyles from './index.style'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return (
      <div style={{ display: 'relative', width: '100%', overflow: 'auto' }} className={styles.container}>
        <table ref={ref} className={styles.table} {...props} />
      </div>
    )
  }
)
Table.displayName = 'Table'

export default Table
