$(function () {
    var tn = GetUrlParam("param");
    // console.log(tn);
$.ajax({
    url: "../../../json/1.json",
    async: false,
    type: "get",
    dataType: "json",
    success:function (data) {
        var html = ''
        $.each(data.data,function (i,n) {
            html += '<li><div class="Card"><a href="../../../src/html/DetStation/DetStation.html?param='+ n.code +'"><img src="../../../src/images/file.png" alt="检测线" style="display: inline-block"><h4 style="display: inline-block">'+ n.code +'</h4></a></div></li>'
            if(tn === n.code){
                $("#Form2").form("load",data.data[i])
            }
        })
        html += '<li><div class="Card1"><a href="../../../src/html/DetStation/DetStation.html"><img src="../../../src/images/add.png" alt="检测工位" style="display: inline-block"></a></div></li>'
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
        if(name == ''){
            alert("检测线名称不能为空")
        }else if(code == ''){
            alert("编号不能为空")
        }else if(testClass == ''){
            alert("许可检测类别")
        }
        return true;
    }


    //点击提交按钮
    $(".submitBtn").click(function () {
        var isClick = judge()
    })

})

