/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-4-24
 * Time: 上午10:56
 * 文件功能描述：属性识别功能模块接口.
 */

dojo.require("esri.toolbars.draw");

function IdentifyTasks() {
    var connectEvent;
    var identifyMap;
    var identifyParameters;
    var identifyTimes;
    var identifyTask;
    var anchorPoint; //鼠标点击坐标
    var currLayerName; //当前点击的层名
    this.identifyHandler = function(map, options) {
        identifyMap = map;
        taskOptions = options;
    }

    this.getSelectedLayer = function()
    {

    }
     function doIdentify(evt) {

        identifyMap.graphics.clear();
        identifyMap.infoWindow.hide();
        identifyParameters = new IdentifyParametersHelper();
        anchorPoint = evt.mapPoint;
        var tolerace = new identifyParameters.tolerance(3);
        var layerOption = new identifyParameters.layerOption(esri.tasks.IdentifyParameters.LAYER_OPTION_ALL);
        var width = new identifyParameters.width(identifyMap.width);
        var height = new identifyParameters.height(identifyMap.height);
        var mapExtent = new identifyParameters.mapExtent(identifyMap.extent);
        var geometry = new identifyParameters.geometry(evt.mapPoint);
        var returnGeometry = new identifyParameters.returnGeometry(true);

        var layerIds = identifyMap.layerIds;
        var layerLength = layerIds.length;
        identifyTimes = layerLength;

        identifyTaskExecute(identifyMap, identifyParameters.identifyParameters);
    }

    identifyTaskExecute = function (map, ip) {
		
        identifyTimes--;
        if (identifyTimes >= 0) {
            var layer = map.getLayer(map.layerIds[identifyTimes]);
            if (layer instanceof esri.layers.ArcGISDynamicMapServiceLayer
                || layer instanceof esri.layers.ArcGISTiledMapServiceLayer) {
                var url = layer.url;
                var vlayerIds = [];
                if (layer.visible == false || layer.opacity <= 0) {
                    this.identifyTaskExecute(identifyMap, identifyParameters.identifyParameters);
                    return;
                }
                if (layer instanceof esri.layers.ArcGISDynamicMapServiceLayer) {
					var visibleLayerIds = layer.visibleLayers; //查可视图层
					if(getkgVisible()){
						 vlayerIds.push(13);	//此处直接入控规动态层ID号
						 visibleLayerIds = visibleLayerIds.concat(vlayerIds);
						 
//						vlayerIds = vlayerIds.concat([13]); //此处直接入控规动态层ID号
					}
					
                }
               
                //var copyLayerIds =  visibleLayerIds.concat();

                //删除层号小于0的层
                for(var i=0;i<visibleLayerIds.length;i++)
                {
                    if(visibleLayerIds[i] < 0)
                    {
                        visibleLayerIds.splice(i,1);
                        //copyLayerIds = copyLayerIds.slice(i+1);
                    }
                }
                ip.layerIds = visibleLayerIds;
                //ip.layerIds = copyLayerIds.reverse();
                identifyTask = new IdentifyTaskHelper(url);
                identifyTask.execute(ip, identifyCompleteHandler, errorHandler);
            }
        }
    }


    identifyCompleteHandler = function (identifyResults) {
        if (identifyResults && identifyResults.length>0 ) {

            var identifyResult = identifyResults[0];
            currLayerName = identifyResult.layerName;  //被选层名
            var graphic = identifyResult.feature;

            if (!check(graphic.attributes)) {
                //显示属性图表
                onMapClick(null,null);
                return;
            }

            if (graphic.geometry instanceof esri.geometry.Point) {
                var sms = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE).setColor(new dojo.Color([255, 0, 0, 0.5]));
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

            identifyMap.graphics.add(graphic);

            //显示属性图表
            //onMapClick(graphic.attributes);
            switchPage("east-panel","property-grid");
            PropertyGrid.setSource(graphic.attributes);
        }
        else {
            this.identifyTaskExecute(identifyMap, identifyParameters.identifyParameters);
        }

    }
    getLayerIds = function (targetLayer) {
        if (targetLayer instanceof esri.layers.ArcGISDynamicMapServiceLayer
            || targetLayer instanceof esri.layers.ArcGISTiledMapServiceLayer) {

            var layerInfos = targetLayer.layerInfos;
            if (layerInfos == null || layerInfos.length == 0) return [];
            var layerIds = [];
            for (var i = 0; i < layerInfos.length; i++) {
                var layerInfo = layerInfos[i];
                layerIds.push(layerInfo.id);
            }

            return layerIds;
        }
        else {
            return null;
        }
    }
    this.activeIdentifyEvent = function ()
    {
        //只激活一次
        connectEvent = dojo.connect(identifyMap, "onClick", doIdentify);
    }

    //取消激活
    this.deactiveIdentifyEvent = function()
    {
        if(connectEvent)
        {
            dojo.disconnect(connectEvent);
            connectEvent = null;
        }
        if(identifyMap)
        {
           // identifyMap.graphics.clear();
           // identifyMap = null;
        }
    }

    function errorHandler(error) {
        showRightContent("identityDiv","属性识别");
        $("#identityTable").empty();
        var res = "<tr><td>未查询到结果</td></tr>";
        $("#identityTable").append(res);
    }

    this.getVisibleLayerCount = function (map) {
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

    function getkgVisible()
	{
		for(key in titleMap)
		{
			var titleName = titleMap[key]["name"];
			if(/[控规]/.test(titleName))
			{
				if( map.getLayer(titleMap[key]["title"]).visible){
					return true;
				}
				else{return false;}
			}
			
		}
		return false;
	}
    function onMapClick(attributs) {
//        if(ttt == 0){
//            showRightContent("identityDiv",currLayerName);
//        }
//        else{
//            $("#rightContentName").text(currLayerName);
//        }
//        ttt=1;


        if (attributs)
        {
            document.getElementById("identityTable").innerHTML = "";
            var tablehtml = "<tr><td>属性</td><td>内容</td></tr>";
            $("#identityTable").append(tablehtml);

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
                document.getElementById("identityTable").appendChild(row);
            }
        }
        else{

        }
    }

    function check(obj) {
        if (!taskOptions)
            return true;

        if (!taskOptions.layerException) {
            return true;
        }

        var le = taskOptions.layerException;
        for (var i = 0; i < le.length; i++) {
            if (obj[le[i].name] == le[i].value)
                return false;
        }
        return true;
    }
}