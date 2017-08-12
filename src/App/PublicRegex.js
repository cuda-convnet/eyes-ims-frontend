//正则表达式
const REGEX = {
    PHONE : /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    NUMBER10 : /^\d{10}$/,
    CHINESE5_OR_LETTER10 : /^([A-Za-z]{1,10}|[\u4E00-\u9FA5]{1,5})$/,
    WITHOUT_SPECIAL_CHARACTER: /^[^\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/]+$/
}


//导出
export {REGEX};
