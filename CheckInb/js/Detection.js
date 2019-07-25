
$(document).ready(function () {
    Rendering()//页面打开记录列表渲染
// 页面两侧伸展
    $(function () {
        $('#btn1').mouseenter(function () {
            $("#fold_left").animate({width:"20%"});
            $("#btn1").css("display","none");
        })
        $("#fold_left").mouseleave(function () {
            $("#fold_left").animate({width:"0"});
            $("#btn1").css("display","block");
        })
        $("#btn2").mouseenter(function () {
            $("#fold_right").animate({width:"20%"});
            $("#btn2").css("display","none");
        })
        $("#fold_right").mouseleave(function () {
            $("#fold_right").animate({width:"0"});
            $("#btn2").css("display","block");
        })
    });

    //号牌种类
    let LicenseTypeData=[
        {id:"01",carType:"小型汽车"},{id:"02",carType:"大型汽车"},{id:"03",carType:"使馆汽车"},
        {id:"04",carType:"领馆汽车"},{id:"05",carType:"境外汽车"},{id:"06",carType:"外籍汽车"},
        {id:"07",carType:"普通摩托车"},{id:"08",carType:"轻便摩托车"},{id:"09",carType:"使馆摩托车"},
        {id:"10",carType:"领馆摩托车"},{id:"11",carType:"境外摩托车"},{id:"12",carType:"外籍摩托车"},
        {id:"13",carType:"低速车"},{id:"14",carType:"拖拉机"},{id:"15",carType:"挂车"},
        {id:"16",carType:"教练汽车"},{id:"17",carType:"教练摩托车"},{id:"18",carType:"试验汽车"},
        {id:"19",carType:"试验摩托车"},{id:"20",carType:"临时入境汽车"},{id:"21",carType:"临时入境摩托车"},
        {id:"22",carType:"临时行驶车"},{id:"23",carType:"警用汽车"},{id:"24",carType:"警用摩托"},
        {id:"25",carType:"原农用号牌"},{id:"26",carType:"香港入境汽车"},{id:"27",carType:"澳门入境汽车"},
        {id:"大型新能源汽车",carType:"大型新能源汽车"},{id:"小型新能源汽车",carType:"小型新能源汽车"}]

    //号牌颜色
    let PlateColorData=[
        {id:"0",color:"蓝牌"},{id:"1",color:"黄牌"},{id:"2",color:"白牌"},{id:"3",color:"黑牌"},
        {id:"4",color:"新能源"},{id:"5",color:"其他"}]

    //两侧动态添加数据
    function Rendering(){
        var dateNow=new Date()
        var time = dateNow.getFullYear() + "-" +((dateNow.getMonth()+1)<10?"0":"")+(dateNow.getMonth()+1)+"-"+(dateNow.getDate()<10?"0":"")+dateNow.getDate();
        let LicenseType=''//号牌种类替换
        let PlateColor=''//号牌颜色替换
        $.ajax({
            url:"http://192.168.0.222:8038/Testing/GetCheckInVehList",
            method:'post',
            data:{bjrqks:time,bjrqjs:time,page:1,rows:10000,checkMethod:"",keyWord:"",licenseType:""},
            success:function (data) {
                var CheckHtml ='';
                var ModelHtml ='';

                $.each(data.rows.reverse(),(i,n)=>{
                    console.log(n)
                    $.each(LicenseTypeData,(index,item)=>{
                        if(item.id==n.LicenseType){
                            LicenseType= item.carType
                        }
                    })
                    $.each(PlateColorData,(index,item)=>{
                        if(item.id==n.PlateColor){
                            PlateColor= item.color
                        }
                    })
                    CheckHtml += '<tr><td>'+ n.License +'</td><td>'+ LicenseType +'</td><td>'+PlateColor +'</td></tr>'//动态生成报检记录
                    ModelHtml += '<tr><td>'+ n.VehicleKind +'</td><td>'+ n.VIN +'</td></tr>'
                })
                $(".checkList").html(CheckHtml);
                $(".modelList").html(ModelHtml);
            }
        })
    }

// ajax数据请求自动查询跟添加数据
    $(function () {
        //点击放大镜按钮事件
        $("#VehicleModel").textbox({
            icons: [{
                iconCls:'icon-search',
                handler: function(){
                    VehicleTypeMatch();
                }
            }]
        })
        $("#VIN").textbox({
            icons: [{
                iconCls:'icon-search',
                handler: function(){
                    NumberPlateMatch(1);
                }
            }]
        })
        $("#License").textbox({
            icons: [{
                iconCls:'icon-search',
                handler: function(){
                    NumberPlateMatch(2);
                }
            }]
        });

        //加载车辆信息（根据号牌号码、VIN、车牌颜色获取车辆信息）
        function NumberPlateMatch(type) {
            var Type = type;
            var vin = $("#VIN").textbox("getText"); //获取vin值
            var license = $("#License").textbox("getText"); //获取车牌
            var LicenseType = $("#LicenseType").combobox("getValue");//获取车辆种类
            var PlateColor = $("#PlateColor").combobox("getValue");//获取车牌颜色
            var NetworkFlag = $("#lwjcBtn").switchbutton("options").checked == true ? 1 : 0;//判断是否脱机
            $.ajax({
                url: "/Testing/CopyVehicleInfo",
                type: "post",
                dataType: "json",
                data: {
                    License: license,
                    VIN: vin,
                    PlateColor: PlateColor,
                    LicenseType: LicenseType,
                    NetworkFlag: NetworkFlag,
                    "type": Type,
                },
                success:function (data) {
                    if(data.success == 1){
                        $("#form1").form("load", data.result);  //数据渲染到form表单
                    }else{
                        $.messager.alert("消息提示",data.result,"info");
                    }
                },
                err:function () {
                    $.messager.alert("错误提示","请求数据失败","error");
                }
            })
        }

        //车辆类型匹配数据
        function VehicleTypeMatch(){
            let VehicleModel = $("#VehicleModel").textbox("getText");//车辆型号
            $.ajax({
                url:"/Testing/GetDefaultVehicleInfo",
                dataType:'json',
                method:'post',
                data:{VehicleModel:VehicleModel},
                success:function (data) {
                    if(data.success == 1){
                        $("#form1").form("load", data.tag);//数据渲染到form表单
                    }else{
                        $.messager.alert("消息提示",data.result,"info");
                    }
                },
                err:function () {
                    $.messager.alert("错误提示","请求数据失败","error");
                }
            })
        }
    })


    // 保存数据信息
    $(function () {
        $(".btn_one").on("click",function () {
            //数据合法性检测
            if(dataJudgment()){
                //数据的获取
                var  userData= {};
                var form = $('#form1').serializeArray();
                $.each(form, function() {
                    userData[this.name] = this.value;
                });
                $.ajax({
                    url:"/Testing/SetDefaultVehicleInfo",
                    dataType:'json',
                    method:'post',
                    data:userData,
                    success:function (data) {
                        $.messager.alert("消息提示","你好，数据"+data.result,"info");
                        window.location.reload();  //页面提交完成后刷新页面
                    },
                    err:function () {
                        $.messager.alert("错误提示","数据保存失败","error");
                    }
                })
            }
        });

        //数据的检测
        function dataJudgment() {
            var leaveDate = $("#LeaveFactoryDate").textbox("getText");//出厂日期
            var regisDate = $("#RegisterDate").textbox("getText");//上牌日期
            var tireData =$("#DriveTirePressure").textbox("getText");//胎压数据
            var rotaData=$("#RatedRev").textbox("getText");//转速数据
            var regTime = /\d{4}-\d{2}-\d{2}/;//日期正则匹配
            var Torque = $("#Torque").textbox("getText");//额定扭矩
            var BoardHeight = $("#BoardHeight").textbox("getText");//栏板高度
            //检查必填数据是否填写
            if (!$("#form1").form("validate")) {
                $.messager.alert("错误提示","带<span style='color: red'>*</span>为必填项，请认真填写","error");
                return false
            }else if((tireData <= 120 || tireData >= 1000)){  //检查胎压
                $.messager.alert("错误提示","胎压数据填写不符合标准","error");
                return false;
            }else if(rotaData <= 1000 || rotaData >= 6000){  //检查转速
                $.messager.alert("错误提示","转速数据填写不符合标准","error");
                return false;
            }else if(!regTime.test(leaveDate) || !regTime.test(regisDate)){ //日期填写
                $.messager.alert("错误提示","输入的日期格式错误，正确格式为yyyy-mm-dd","error");
                return false;
            }
            else if(Torque <= 2000 || Torque >= 5000){ //额定扭矩
                $.messager.alert("错误提示","扭矩数据填写不符合标准","error");
                return false;
            }else if(BoardHeight >= 1500){ //栏板高度
                $.messager.alert("错误提示","栏板高度填写不符合标准","error");
                return false;
            }
            return true;
        }

        //规则重铸
        $.extend($.fn.datebox.defaults.rules, {
            //上牌日期验证
            sprqValid: {
                validator: function (value) {//true时不阻拦
                    var djrq = new Date(value + "");
                    var ccrqStr = $("#LeaveFactoryDate").datebox("getText") + "";
                    var ccrq = new Date(ccrqStr);
                    return djrq > ccrq;
                },
                message: "上牌日期不能小于出厂日期"//可将param数组使用占位符输出
            },
            //出厂日期验证
            ccrqValid: {
                validator: function (value) {//true时不阻拦
                    var ccrq = new Date(value + "");
                    var nowDate = new Date();
                    return ccrq < nowDate;
                },
                message: "出厂日期不能大于当前日期"//可将param数组使用占位符输出
            }
        });

        //改变燃油方式
        $("#FuelType").combobox({
            onChange: function (nvalue) {
                if (nvalue == "B") {
                    $("#num1").prop("disabled",true);
                    $("#num2").prop("disabled",true);
                    $("#num3").prop("disabled",false);
                    $("#num4").prop("disabled",false);
                    $("#FuelGrade").combobox("setValue", "0");
                    $("#num3").prop("checked",true);
                    $("#num1").prop("checked",false);//设置为未选中
                    $("#num2").prop("checked",false);//设置为未选中
                } else {
                    $("#num1").prop("disabled",false);
                    $("#num2").prop("disabled",false);
                    $("#num3").prop("disabled",true);
                    $("#num4").prop("disabled",true);
                    $("#num1").prop("checked",true);
                    $("#FuelGrade").combobox("setValue", "92");
                    $("#num3").prop("checked",false);//设置为未选中
                    $("#num4").prop("checked",false);//设置为未选中
                }
                $("#OptionOne").prop("checked","checked");
                $("#OptionTwo").prop("checked","checked");
            }
        });

        //安检必填字段匹配
        function A_monitor(){
            if($("#AxleForm").combobox("getValue") == ''){  //轴制
                $.messager.alert("消息提示","请选择轴制","info");
                return false;
            }else if($("#BusinessType").combobox("getValue") == ''){//业务类型
                $.messager.alert("消息提示","请选择业务类型","info");
                return false;
            }else if($("#OverallLong").textbox("getText") == '' || $("#OverallWide").textbox("getText") == '' || $("#OverallHigh").textbox("getText") == ''){
                $.messager.alert("消息提示","请填写外廓尺寸","info");
                return false;
            }else if($("#Category").combobox("getValue") == ''){//所属类别
                $.messager.alert("消息提示","请选择所属类别","info");
                return false;
            }else if($("#Torque").textbox("getText") == ''){   //扭矩
                $.messager.alert("消息提示","请填写扭矩","info");
                return false;
            }else if($("#TireSpecifications").textbox("getText") == ''){   //轮胎规格
                $.messager.alert("消息提示","请填写轮胎规格","info");
                return false;
            }else if($("#BoardHeight").textbox("getText") == ''){   //栏板高度
                $.messager.alert("消息提示","请填写栏板高度","info");
                return false;
            }else if($("#DrivingLicense").textbox("getText") == ''){   //行驶证
                $.messager.alert("消息提示","请填写行驶证","info");
                return false;
            }else if($("#LightQuality").combobox("getValue") == ''){//灯制
                $.messager.alert("消息提示","请选择灯制","info");
                return false;
            }else if($("#GearsNumber").combobox("getValue") == ''){//档位
                $.messager.alert("消息提示","请选择档位","info");
                return false;
            }else if($("#StandardFuelConsumption").textbox("getText") == ''){   //油耗
                $.messager.alert("消息提示","请填写达标油耗","info");
                return false;
            }else if($("#VehicleColor").combobox("getValue") == ''){ //车身颜色
                $.messager.alert("消息提示","请选择车身颜色","info");
                return false;
            }else if($("#ShaftForm").combobox("getValue") == ''){//并装轴制
                $.messager.alert("消息提示","请选择并装轴制","info");
                return false;
            }else if($("#DriveShaftPosition").textbox("getText") == ''){   //驱动轴位
                $.messager.alert("消息提示","请填写驱动轴位","info");
                return false;
            }else if($("#FrontTrack").textbox("getText") == ''){   //前轮距
                $.messager.alert("消息提示","请填写前轮距","info");
                return false;
            }else if($("#StandardFuelConsumption").textbox("getText") == ''){   //达标油耗
                $.messager.alert("消息提示","请填写达标油耗","info");
                return false;
            }else if($("#A_monitor").combobox("getValue") == ''){ //安检类型
                $.messager.alert("消息提示","请选择安检类型","info");
                return false;
            }
            return true;
        }
        //综检必填字段匹配
        function Z_monitor(){
            if($("#BrakingMethod").combobox("getValue") == ''){  //制动方式
                $.messager.alert("消息提示","请选择制动方式","info");
                return false;
            }else if($("#Odometer").textbox("getText") == ''){   //里程读数
                $.messager.alert("消息提示","请填写里程读数","info");
                return false;
            }else if($("#AxleForm").combobox("getValue") == ''){  //轴制
                $.messager.alert("消息提示","请选择轴制","info");
                return false;
            }else if($("#BusinessType").combobox("getValue") == ''){
                $.messager.alert("消息提示","请选择业务类型","info");
                return false;
            }else if($("#OverallLong").textbox("getText") == '' || $("#OverallWide").textbox("getText") == '' || $("#OverallHigh").textbox("getText") == ''){
                $.messager.alert("消息提示","请填写外廓尺寸","info");
                return false;
            }else if($("#Category").combobox("getValue") == ''){
                $.messager.alert("消息提示","请选择所属类别","info");
                return false;
            }else if($("#DriveShaftPosition").textbox("getText") == ''){   //驱动轴位
                $.messager.alert("消息提示","请填写驱动轴位","info");
                return false;
            }else if($("#FrontTrack").textbox("getText") == ''){   //前轮距
                $.messager.alert("消息提示","请填写前轮距","info");
                return false;
            }else if($("#Torque").textbox("getText") == ''){   //扭矩
                $.messager.alert("消息提示","请填写扭矩","info");
                return false;
            }else if($("#TireSpecifications").textbox("getText") == ''){   //轮胎规格
                $.messager.alert("消息提示","请填写轮胎规格","info");
                return false;
            }else if($("#DrivingLicense").textbox("getText") == ''){   //行驶证
                $.messager.alert("消息提示","请填写行驶证","info");
                return false;
            }else if($("#LightQuality").combobox("getValue") == ''){//灯制
                $.messager.alert("消息提示","请选择灯制","info");
                return false;
            }else if($("#StandardFuelConsumption").textbox("getText") == ''){   //达标油耗
                $.messager.alert("消息提示","请填写达标油耗","info");
                return false;
            }else if($("#VehicleColor").combobox("getValue") == ''){ //车身颜色
                $.messager.alert("消息提示","请选择车身颜色","info");
                return false;
            }else if($("#ShaftForm").combobox("getValue") == ''){//并装轴制
                $.messager.alert("消息提示","请选择并装轴制","info");
                return false;
            }else if($("#OperationalLicenseNumber").textbox("getText") == ''){   //营运证号
                $.messager.alert("消息提示","请填写营运证号","info");
                return false;
            }else if($("#VehicleGrade").combobox("getValue") == ''){//车辆等级
                $.messager.alert("消息提示","请选择车辆等级","info");
                return false;
            }else if($("#Z_monitor").combobox("getValue") == ''){//综检类型
                $.messager.alert("消息提示","请选择综检类型","info");
                return false;
            }
            return true;
        }
        //环检必填字段匹配
        function H_monitor(){
            if($("#GearsNumber").combobox("getValue") == ''){  //档位
                $.messager.alert("消息提示","请选择档位","info");
                return false;
            }else if($("#Telephone").textbox("getText") == ''){   //联系方式
                $.messager.alert("消息提示","请填写联系方式","info");
                return false;
            }else if($("#OBD").textbox("getText") == ''){   //OBD
                $.messager.alert("消息提示","请填写OBD","info");
                return false;
            }else if($("#H_monitor").combobox("getValue") == ''){//环检类型
                $.messager.alert("消息提示","请选择环检类型","info");
                return false;
            }
            return true;
        }



      //检测选项框为灰色
        $("#OptionOne").change(function (e) {
            var _this = $(this);
            if(_this.is(":checked")){
                $(".A_detection input").attr("disabled",false);
            }else{
                $(".A_detection input").attr("disabled",true);
                $("#Aidentify").disabled=true;
            }
        });
        $("#OptionTwo").change(function (e) {
            var _this = $(this);
            if(_this.is(":checked")){
                $(".H_detection input").attr("disabled",false);
            }else{
                $(".H_detection input").attr("disabled",true);
                // $("#Zidentify option").attr("disabled", true);
                $("#Zidentify").removeAttr("disabled");
            }
        });
        $("#UseProperty").combobox({
            onChange: function (nvalue) {
                if (nvalue == "非营运") {
                    $("#OptionThree").prop("checked","checked");
                    $(".Z_detection input").attr("disabled",false);
                } else {
                    $("#OptionThree").prop("checked",false);
                    $(".Z_detection input").attr("disabled",true);
                }
            }
        });


        //报检
        function SaveData() {
            var userData = {};
            var form = $('form').serializeArray();
            $.each(form, function () {
                userData[this.name] = this.value;
            });
            console.log(userData)
            $("#form1").form("submit", {
                url: "/Testing/VehicleInfoLogin",
                onSubmit: function (param) {
                    param.OBD = $("#OBD").prop("checked") ? "有" : "无";//obd有无
                    param.HighBeam = $("#HighBeam").prop("checked") ? "有" : "无";//远关能否调整
                    param.DoubleSteeringShaft = $("#DoubleSteeringShaft").prop("checked") ? "有" : "无";//双转向轴
                    param.DoubleFrontAxle = $("#DoubleFrontAxle").prop("checked") ? "有" : "无";//双前轴
                    param.SteeringType = $("#SteeringType").prop("checked") ? "有" : "无";//独立悬挂
                    param.NetworkFlag = $("#lwjcBtn").switchbutton("options").checked == true ? 1 : 0;//脱机检测
                    param.CheckMethod = $("input[name='radioMethod']:checked").val();//检测方式
                    // console.log(param.OBD)
                },
                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data)
                    if(data.success == 1){
                        Rendering()//两侧动态添加报检记录
                        if (data.tag.CheckMethod != "") {
                            $.messager.alert("消息提示","报检成功","info");
                            window.open("../../Report/FaceReport.aspx?TestNo=" + data.result);
                        }
                    }else {
                        $.messager.alert("错误提示",data.result,"error");
                    }
                }
            });
        }


        //报检按钮检测
        $(".btn_two").click(function () {
            if($("#OptionOne").is(':checked')){  //安检必填项审查
                if(!A_monitor()){
                    return;
                }else if($("#OptionTwo").is(':checked')){//环检必填项审查
                    if(!H_monitor()) {
                        return;
                    }
                }else if($("#OptionThree").is(':checked')){//综检必填项审查
                    if(!Z_monitor()){
                        return;
                    }else {
                        run()
                    }
                }
            }else if($("#OptionTwo").is(':checked')){//环检必填项审查
                if(!H_monitor()){
                    return;
                }else if($("#OptionThree").is(':checked')){//综检必填项审查
                    if(!H_monitor()){
                        return;
                    }else {
                        run()
                    }
                }
            }else if($("#OptionThree").is(':checked')){//综检必填项审查
                if(!Z_monitor()){
                    return;
                }else {
                    run()
                }
            }else{
                $.messager.alert("消息提示","最少选择一项检测类别","info");
                return;
            }

            function run() {
                if(dataJudgment()) {  //检测数据
                    if (!($("#lwjcBtn").switchbutton("options").checked)) {
                        $.messager.confirm({
                            title: "消息",
                            msg: "您确定要脱机检测吗？",
                            fn: function (s) {
                                if (s)
                                    SaveData()
                            }
                        });
                    }else {
                        SaveData()
                    }
                }
            }
        })

    })
})







