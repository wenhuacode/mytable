import {createStyles} from 'antd-style'

export default createStyles(({token, css}) => ({
  row: css `
    border-bottom-width: 1px;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    &:hover {
      background-color: rgba(59,130,246,.5);
    };
    [data-state="selected"] {
      background-color: rgb(59,130,246);
    };
  `
}))