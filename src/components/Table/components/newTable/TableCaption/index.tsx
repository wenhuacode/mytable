import * as React from 'react'
import usestyles from './index.style'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => {
    const { styles } = usestyles()

    return <caption ref={ref} className={styles.caption} {...props} />
  }
)
TableCaption.displayName = 'TableCaption'

export default TableCaption
