/*-----------时间格式化工具--------*/
import dateFormat from 'dateformat'

export default (date, format) => {
  return dateFormat(date, format)
}
