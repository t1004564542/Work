$(function () {
    //获取数据
    $.ajax({
        url: "./json/1.json",
        async: false,
        type: "get",
        dataType: "json",
        success:function (data) {
            var html =''
            $.each(data.data,function (i,n) {
                // console.log(n.code);
              html += '<li><div class="Card"><a href="src/html/Testline/Testline.html?param='+ n.code +'"><img src="src/images/file.png" alt="" style="display: inline-block"><h4 style="display: inline-block">'+ n.name +'</h4></a></div></li>'
            })
            html += '<li><div class="Card1"><a href="src/html/Testline/Testline.html"><img src="src/images/add.png" alt="" style="display: inline-block"></a></div></li>'
            $(".test-line").html(html);
        },
        error: function (xhr, textStatus) {
            console.log("错误");
            console.log(xhr);
            console.log(textStatus);
        }
})
    //判断必填字段
    function judge(){
        let name = $("#name").textbox("getText");
        let code = $("#code").textbox("getText");
        let address = $("#address").textbox("getText");
        let areacode = $("#areacode").textbox("getText");
        let telephone = $("#telephone").textbox("getText");
        let certificateNo = $("#certificateNo").textbox("getText");
        if(name == ''){
            alert("检测站名称不能为空")
            return false;
        }else if(code == ''){
            alert("编号不能为空")
            return false;
        }else if(address == ''){
            alert("地址不能为空")
            return false;
        }else if(areacode == ''){
            alert("行政区编号不能为空")
            return false;
        }else if(telephone == ''){
            alert("电话不能为空")
            return false;
        }else if(certificateNo == ''){
            alert("资质以定证书编号不能为空")
            return false;
        }
        return true;
    }
    //点击提交按钮
    $(".submitBtn").click(function () {
        var userDate = {}
        var Form = $('#Form1').serializeArray();
        var isClick = judge()
        $.each(Form,function () {
            userDate[this.name] = this.value;
        })
        // console.log(userDate);
        if (isClick == true) {
            $.ajax({
                type: "POST",
                dataType: 'json',
                url: "./json/a.php",
                data: userDate,
                ontentType: 'utf8',
                async: false,
                success: function (data) {
                    console.log(data)
                },
                error: function () {
                    console.log("提交失败")
                }
            })
        }
    })

})


