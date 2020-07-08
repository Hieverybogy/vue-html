export const DateFormatTypes = {
    yMd: { type: 'date', label: '日期格式(yyyy-MM-dd)', format: 'yyyy-MM-dd' },
    // 5: '日期范围(yyyy-MM-dd)',
    // 6: '日期范围(yyyy-MM-dd hh:mm:ss)',
    yMdhm: { type: 'datetime', label: '时间格式(yyyy-MM-dd hh:mm)', format: 'yyyy-MM-dd hh:mm' },
    yMdhms: { type: 'datetime', label: '时间格式(yyyy-MM-dd hh:mm:ss)', format: 'yyyy-MM-dd hh:mm:ss' }
}

export const NumberFormatTypes = {
    normal: '常规',
    thousand: '会计格式'
}
