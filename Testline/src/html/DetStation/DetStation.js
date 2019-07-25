$(function () {
    var tn = GetUrlParam("param");
    // console.log(tn);
    $.ajax({
        url: "../../../json/2.json",
        async: false,
        type: "get",
        dataType: "json",
        success:function (data) {
            // console.log(data)
            var html = ''
            $.each(data.data,function (i,n) {
                html += '<li><div class="Card"><a href="../../../src/html/Detection/Detdevice.html?param='+ n.sysName +'"><img src="../../../src/images/file.png" alt="检测线" style="display: inline-block"><h4 style="display: inline-block">'+ n.sysName +'</h4></a></div></li>'
                if(tn === n.code){
                    $("#Form3").form("load",data.data[i])
                }
            })
            html += '<li><div class="Card1"><a href="../../../src/html/Detection/Detdevice.html"><img src="../../../src/images/add.png" alt="检测工位" style="display: inline-block"></a></div></li>'
            $(".test-line").html(html);
            // console.log(data.data.name)
            // console.log(data.data[0]);
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
        let testClass = $("#testClass").combobox("getValue");
        let testItem = $("#testItem").combobox("getValue");
        let pcIp = $("#pcIp").textbox("getText");
        let pcPassword = $("#pcPassword").textbox("getText");
        if(name == ''){
            alert("工位名称不能为空")
        }else if(code == ''){
            alert("编号不能为空")
        }else if(testClass == ''){
            alert("许可检测类别不能为空")
        }else if(testItem == ''){
            alert("许可检测项目不能为空")
        }else if(pcIp == ''){
            alert("工位机IP地址不能为空")
        }else if(pcPassword == ''){
            alert("工位机管理密码不能为空")
        }
        return true;
    }


    //点击提交按钮
    $(".submitBtn").click(function () {
        // var Form = $('#Form1').serializeArray();
        // console.log(Form)

        var isClick = judge()

        alert(isClick)
    })

})
