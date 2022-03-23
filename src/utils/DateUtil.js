var relativeTime = require('dayjs/plugin/relativeTime')
const dayjs = require("dayjs");
require('dayjs/locale/zh-cn')
dayjs.extend(relativeTime)

///格式化日期
function formatDateUtil(time) {
    return dayjs().locale('zh-cn').to(dayjs(time))
}

export {formatDateUtil}