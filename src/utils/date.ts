import dayjs from "dayjs";


export function getDateStrWithMs(ms: number) {
    return dayjs(ms).locale('zh-cn').format('YYYY-MM-DD')
}