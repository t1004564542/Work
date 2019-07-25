//获取url参数
function GetUrlParam(name) {
    var reg = new RegExp("(\\u003F|&)" + name + "=[^&]*&", "g");
    var paramStr = (window.location.search + "&").match(reg);
    if (paramStr == null) {
        return null;
    }
    else {
        return paramStr[0].substr(paramStr[0].indexOf("=") + 1).replace("&", "");
    }
}
