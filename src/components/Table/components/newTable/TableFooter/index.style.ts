import {createStyles} from 'antd-style'

export default createStyles(({token}) => ({
  tfoot: {borderTopWidth: '1px', backgroundColor: 'rgba(59,130,246,.5)', fontWeight: '500', '[&>tr]:last': {borderBottomWidth: '0px'}},
}))