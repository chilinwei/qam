$(document).ready(function () {
    //全域變數宣告
    var curveitem = [];
    var curvedata = [];
    var id, fc, ami, amq;
    //物件函數宣告
    var dataitems = function (id, fc, xi, xq) {
        this.id = id;
        this.label = "(" + xi + "," + xq + ")";
        this.fc = fc;
        this.xi = xi;
        this.xq = xq;
    }

    var dataobjs = function (id, fc, xi, xq) {
        var arr = [];
        for (var i = 0; i <= 10; i += 0.1) {
            arr.push([i, xi * Math.cos(2 * Math.PI * fc * i) + xq * Math.sin(2 * Math.PI * fc * i)]);
        }
        this.id = id;
        this.label = "(" + xi + "," + xq + ")";
        this.data = arr;
    }

    $("#submit").click(function () {
        //資料陣列與索引計數器初始化
        curveitem = [];
        curvedata = [];
        id = 0;
        $("#curveitems").empty()
        //取計算參數
        fc = $("#fc").val();
        ami = $("#ami").val();
        amq = $("#amq").val();
        //alert(fc + "," + ami + "," + amq);

        //依據輸入參數計算curveitem
        for (var xi = (-1) * ami; xi <= ami; xi++) {
            if (xi == 0) { continue }
            for (var xq = (-1) * amq; xq <= amq; xq++) {
                if (xq == 0) { continue }
                id += 1;
                curveitem.push((new dataitems(id, fc, xi, xq)));
            }
        }
        //$("#datasheet").val(JSON.stringify(curveitem));
        //alert(curveitem.length);

        //如果有取得curveitem，建立列表提供選擇
        if (curveitem.length > 0) {
            var tb = document.createElement("table");
            tb.style.border = "1px solid black";

            for (var i = 0; i < Math.ceil(curveitem.length / 10) ; i++) {
                var tr = tb.insertRow();
                for (var j = 0; j < 10; j++) {
                    if (curveitem[i * 10 + j] == null) { break }
                    var td = tr.insertCell();
                    td.style.border = '1px solid black';
                    var inp = document.createElement("input");
                    inp.setAttribute("name", "curveitem");
                    inp.setAttribute("type", "checkbox");
                    inp.setAttribute("value", curveitem[i * 10 + j].id);
                    td.appendChild(inp);
                    td.appendChild(document.createTextNode(curveitem[i * 10 + j].label));
                }
            }
        }
        $("#curveitems").append(tb);
    });

    $("body").on("change", "input", function () {
        //繪圖陣列與畫布初始化
        curvedata = [];
        $("#flotcontainer").empty();

        //取得勾選的checkbox
        var cbxVehicle = new Array();
        $('input:checkbox:checked[name="curveitem"]').each(function (i) { cbxVehicle[i] = this.value; });
        //alert(cbxVehicle.length);

        //檢查並運算QAM
        for (var i = 0; i < cbxVehicle.length; i++) {
            for (var j = 0; j < curveitem.length; j++) {                
                if (curveitem[j].id == cbxVehicle[i]) {
                    curvedata.push((new dataobjs(
                    curveitem[j].id,
                    curveitem[j].fc,
                    curveitem[j].xi,
                    curveitem[j].xq)));
                }
            }
        }

        $("#datasheet").val(JSON.stringify(curvedata));
        $.plot($("#flotcontainer"), curvedata);
    });
});