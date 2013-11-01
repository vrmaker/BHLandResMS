/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-4-24
 * Time: 下午4:10
 * 文件功能描述：地名点定位模块接口.
 */

dojo.require("esri.toolbars.draw");

function FindTasks() {

    var findMap = null;
    var layerID = [] ;    //层号
    var findParameters; //入参类对象
    var findTimes;  //查找层数
    var findVisibleLayerCount;  //可见层数
    var findVisibleLayerTimes;  //
    var findTask;       //查找类对象
    var findTaskResultFunction; //nothing
    var gFindResults;   //通过FindTask获得的查找结果集
    var objsDBRes;      //从Oracle查到的ObjectID,通过ObjectID,获得上面的gFindResults

    this.findHandler = function(map,layerName)
    {
        findMap = map;
        layerID.push(gMapHelper.getDymaticLayerByName(layerName).id);

    }
    this.clearAll = function()
    {
        if(findMap)
        {
            findMap.graphics.clear();
            findMap = null;
        }

    }
    this.doFind = function (findText) {
        findMap.graphics.clear();
        findParameters = new DistFindParametersHelper();

        var contains = new findParameters.contains(true);
        var searchText = new findParameters.searchText(findText);
        var returnGeometry = new findParameters.returnGeometry(true);

        var layerIds = findMap.layerIds;
        var layerLength = layerIds.length;
        findTimes = layerLength;
        findVisibleLayerCount = getVisibleLayerCount(findMap);
        if (findVisibleLayerCount == 0) {
            findTaskResultFunction([]);
            return;
        }
        findVisibleLayerTimes = 0;
        findTaskExecute(findMap, findParameters.findParameters);
    }

    function findTaskExecute(map, ip) {
        findTimes--;
        if (findTimes >= 0) {
            var layer = map.getLayer(map.layerIds[findTimes]);
            if (layer instanceof esri.layers.ArcGISDynamicMapServiceLayer
                || layer instanceof esri.layers.ArcGISTiledMapServiceLayer) {
                if (layer.visible == false || layer.opacity <= 0) {
                    findTaskExecute(findMap, findParameters.findParameters);
                    return;
                }
                findVisibleLayerTimes++;
                var url = layer.url;
                var layerIds = new Array();

                if (layer instanceof esri.layers.ArcGISDynamicMapServiceLayer) {
                    layerIds = layer.visibleLayers ;
                }

                //var copyLayerIds = layerIds.concat([layerID.id]);
                //ip.layerIds = copyLayerIds;
                ip.layerIds = layerID;
                ip.searchFields = ["OBJECTID"];
                findTask = new DistFindTaskHelper(url);
                findTask.execute(ip, findCompleteHandler, errorHandler);
            }
        }
    }

    function findCompleteHandler(findResults) {
        gFindResults = findResults;
        if (findResults && findResults.length>0 ) {
            for(var i=0;i<findResults.length;i++)
            {
                var findResult = findResults[i];
                var graphic = findResult.feature;

                if (graphic.geometry instanceof esri.geometry.Point) {
                    var sms = new esri.symbol.PictureMarkerSymbol("image/loc0.png",35,50);
                    graphic.setSymbol(sms);
                }
                else if (graphic.geometry instanceof esri.geometry.Polyline) {
                    var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.5]), 5);
                    graphic.setSymbol(sls);
                }
                else if (graphic.geometry instanceof esri.geometry.Polygon) {
                    var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.7]), 5), new dojo.Color([151, 219, 20, .7]));
                    graphic.setSymbol(sfs);
                }

                findMap.graphics.add(graphic);
//                var infoTemplate = new esri.InfoTemplate();
//                infoTemplate.setTitle("");
//                infoTemplate.setContent("${*}");
//                graphic.setInfoTemplate(infoTemplate);
//                findMap.graphics.add(graphic);
//                var iw = findMap.infoWindow;
//                setTimeout(function() { iw.hide(); }, 1);

            }
            //显示列表
           // onMapClick(findResults[0].feature.attributes);
            //定位
            findMapLocation(findResults);
        }
        else{
            findTaskExecute(findMap, findParameters.findParameters);
        }

    }
    this.getAddressJSON = function(paramText)
    {
        $.ajax({
            type: "post",
            url: "http://" + interfaceIP + "/bhGIS/qn.ashx?",
            data: {"name": paramText },
            dataType:'json',
            success: function(objs){

                objsDBRes = objs.result;
                var htmlTR = "";
                $("#findAddressTable").empty();				
                if( objsDBRes.length == 0){					
					var tableHead = "<tr><td  align=\"left\" style=\"color:#ef6565;font-size:15px;\" >无结果</td></tr>";
					$("#findAddressTable" ).append(tableHead);
					return;
				}
				var length = "<tr><td colspan = '2' align=\"center\" style=\"color:#ef6565;font-size:15px;\">共查询到 " + objsDBRes.length +" 条结果</td></tr>";
				$("#findAddressTable").append(length);
                var htmlTR = "<tr><td  align=\"left\" style=\"font-weight:bolder;\">项目名称</td><td  align=\"left\" style=\"font-weight:bolder;\">项目地址</td></tr>"
                for(var index=0;index<objsDBRes.length;index++)
                {
                    var objectID = 0;
                    var objectValue = null;
                    var objectAddr = null;
                    var rowIndex = index;
                    for (var key in objsDBRes[index]) {
                        if( key =="IDS")
                        {
                            objectID = Math.floor(objsDBRes[index][key]);
                        }
                        if(key == "项目名称")
                        {
                            objectValue = objsDBRes[index][key];
                        }
                        if(key == "项目地址")
                        {
                            objectAddr = objsDBRes[index][key];
                        }
                    }
                    htmlTR +="<tr onclick=\"findDetail('"+ rowIndex +"','" + objectID +"','"+ objectValue +"')\"><td>"+objectValue+"</td><td>"+objectAddr+"</td></tr>";
                }
                $("#findAddressTable").append(htmlTR);
            }
        });

    }

    findDetail = function(rowIndex,resIndex,objectValue)
    {
        //1.查询
        doFind(resIndex);

    }
    function onMapClick(attributs) {
		$("#findAddressDiv").hide();
		$("#findDetailAddressDiv").show();
		
        if (attributs)
        {
			$("#findDetailAddressTable").empty();
            var tablehtml = "<tr><td colspan=2><div class=\"button\"><a  href=\"javascript:void(0)\" onClick=\"returnFindAddressResult()\">返回</a></div></td></tr>";
            tablehtml += "<tr><td align=\"left\" style=\"font-weight:bolder;\">属性</td><td align=\"left\" style=\"font-weight:bolder;\">内容</td></tr>";
            $("#findDetailAddressTable").append(tablehtml);

            for (var p in attributs) {
                var row = document.createElement("TR");
                var nameCell = document.createElement("TD");
                var valueCell = document.createElement("TD");
                if (p=='FID'|| p == 'OBJECTID' || p=='序号' || p == 'OBJECTID_1'|| p=='KK' || p=='SHAPE_LENG' || p=='SHAPE_LE_1' || p=='SHAPE' || p=='SHAPE.AREA' || p=='SHAPE.LEN'|| p=='Shape' || p=='ID' || p=='FID_' || p=='SDE_SDE_地' || p=='HANDLE' || p=='Id'|| p=='LAYER' || p=='LARFRZN'|| p== 'LYRLOCK' )
                    continue;
                nameCell.innerText = p;
                if(attributs[p] == "Null" || attributs[p] == "")
                {
                    valueCell.innerText = "-----";
                }
                else
                {
                    valueCell.innerText = attributs[p];
                }

                row.appendChild(nameCell);
                row.appendChild(valueCell);
                document.getElementById("findDetailAddressTable").appendChild(row);
            }
        }
        else{

        }
    }

    function errorHandler(error) {
        //alert(error.message);
    }


    findMapLocation = function(findResult) {

            var feature = findResult[0].feature;
            if(feature.geometry instanceof esri.geometry.Point)
            {
                var ptX = feature.geometry.x;
                var ptY = feature.geometry.y;
                var center = new esri.geometry.Point(ptX,ptY, new esri.SpatialReference(2385));
                findMap.centerAndZoom(center,5);    //定位至第5级
            }
            else if (feature.geometry instanceof esri.geometry.Polygon)
            {
                var geoExtent = feature.geometry.getExtent();
                findMap.setExtent(geoExtent);

            }

    }
    function getVisibleLayerCount(map) {
        var layerIds = map.layerIds;
        if (layerIds == null || layerIds.length == 0) return 0;
        var visibleLayerCount = 0;
        for (var i = 0; i < layerIds.length;i++ ) {
            var layer = map.getLayer(map.layerIds[i]);
            if (layer instanceof esri.layers.ArcGISDynamicMapServiceLayer
                || layer instanceof esri.layers.ArcGISTiledMapServiceLayer) {
                if (layer.visible == true && layer.opacity > 0) visibleLayerCount++;
            }
        }

        return visibleLayerCount;

    }

}
function returnFindAddressResult()
{
    $("#findAddressDiv").show();
    $("#findDetailAddressDiv").hide();
}
