import {createStyles} from 'antd-style'

export default createStyles(({token}) => ({
  tbody: {'&_tr:lastChild': {border: '0'}},
}))