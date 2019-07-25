$(function () {
    var tn = GetUrlParam("param");
    url=decodeURI(tn);//转换成中文
    console.log(url)
    $.ajax({
        url: "../../../json/obd.json",
        async: false,
        type: "get",
        dataType: "json",
        success:function (data) {
            $.each(data.data,function (i,n) {
                // console.log(n.name.trim())
                if(url.trim() == n.name.trim()){
                    $("#Form4").form("load",data.data[i])
                }else{
                    // alert("错误")
                }
            })
        },
        err:function f() {
            console.log("错误");
            console.log(xhr);
            console.log(textStatus);
        }
    })
    //判断必填字段是否为空
    function judge(){
        let name = $("#name").textbox("getText");
        let code = $("#code").textbox("getText");
        let manufactor = $("#manufactor").textbox("getText");
        let type = $("#type").textbox("getText");
        let communicationProtocal = $("#communicationProtocal").combobox("getValue");
        let ip = $("#ip").textbox("getText");
        let port = $("#port").combobox("getValue");
        if(name == ''){
            alert("检测设备名称不能为空")
        }else if(code == ''){
            alert("编号不能为空")
        }else if(manufactor == ''){
            alert("生产厂家不能为空")
        }else if(type == ''){
            alert("型号不能为空")
        }else if(communicationProtocal == ''){
            alert("通讯协议不能为空")
        }else if(ip == ''){
            alert("IP地址不能为空")
        }else if(port == ''){
            alert("端口号不能为空")
        }else if(workUnit == ''){
            alert("检测工位模型不能为空")
        }
        return true;
    }


    //点击提交按钮
    $(".submitBtn").click(function () {
        var isClick = judge()
    })

})
