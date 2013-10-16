
dojo.require("esri.map");
dojo.require("esri.layers.agsdynamic");
dojo.require("esri.layers.agstiled");
dojo.require("esri.tasks.query");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.graphic");
dojo.require("esri.symbol");


/*从一个数组中出去某以元素，obj为数组名称，val为元素名称*/
foreach = function (obj, val){
	var arr=[] ;
    if(obj.length ==0){
        return arr;
    }	
    for(var i=0; i<obj.length; i++) {		
        if(obj[i] == val) {
           continue;
        }
		else{
			arr.push(obj[i]);
		}		
    }
    return arr;
};

function MapHelper(map) {

    var targetMap = map;
  
    this.map = map;
	
    this.height = targetMap.height;

    this.id = targetMap.id;

  
    this.infoWindow = targetMap.infoWindow;

    this.isZoomSlider = targetMap.isZoomSlider;

    this.layerIds = targetMap.layerIds;

    this.loaded = targetMap.loaded;

    this.width = targetMap.width;
    
   //根据配置文件添加动态地图数据
    this.addArcGISDynamicMapServiceLayer = function() {	
		if(dymaticMap == null ){
				return;	
		}
        var dynamicMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://" + dymaticMapIp + "/ArcGIS/rest/services/" + dymaticMapName + "/MapServer",{"id":dymaticMapName});		
		targetMap.addLayer(dynamicMapServiceLayer);	
    }
	//根据配置文件添加切片数据
    this.addArcGISTiledMapServiceLayer = function() {		
		if(titleMap == null ){
			return;	
		}      
		for(key in titleMap){
			var tileMapServiceLayer =  new esri.layers.ArcGISTiledMapServiceLayer("http://" + titleMap[key]["ip"] + "/ArcGIS/rest/services/" + titleMap[key]["title"] + "/MapServer",{"id":titleMap[key]["title"],"opacity": titleMap[key]["alpha"]});	
			tileMapServiceLayer.visible= titleMap[key]["visible"];				
			targetMap.addLayer(tileMapServiceLayer);
					
		}      
    }
	//设置切片地图的可见
	this.setTitleMapVisible= function(btnID){
//		for(key in titleMap){
//			map.getLayer(titleMap[key]["title"]).setVisibility(0);
//		}
		for(key in titleMap){
			var wTitleName = btnID;

			if(titleMap[key]["title"] == wTitleName){
                var test = map.getLayer(titleMap[key]["title"]).visible;
                if(map.getLayer(titleMap[key]["title"]).visible){		//判断图层是否可视，若不可使设置可视，若可视设置不可视
					map.getLayer(titleMap[key]["title"]).setVisibility(0);					
				} 
				else{			
					map.getLayer(titleMap[key]["title"]).setVisibility(1);
				}
				return map.getLayer(titleMap[key]["title"]).visible;
				break;
			}
		}
		
	}
	//设置动态地图中图层的可见
	this.setDymaticMapVisible = function(btnID){
		var wDymaticName = btnID;
		var wDymaticLayers = map.getLayer(dymaticMapName);
		var wDymaticVisLayers = wDymaticLayers.visibleLayers;
		var visibleindex;
		for(key in dymaticMap){	
			if(dymaticMap[key].title == wDymaticName){//首先判断配置文件中的名称与所选择的的名称是否匹配
				for(var i=0;i<wDymaticLayers.layerInfos.length;i++){
					if(dymaticMap[key].title == wDymaticLayers.layerInfos[i].name){
						if(dymaticMap[key]["visible"] == "1"){
							wDymaticVisLayers = foreach(wDymaticVisLayers,wDymaticLayers.layerInfos[i].id);
							dymaticMap[key]["visible"] = 0;
						}
						else{
							wDymaticVisLayers.push(wDymaticLayers.layerInfos[i].id);							
							dymaticMap[key]["visible"] = 1;							
						}
						break;						
					}		
				}
				visibleindex =  dymaticMap[key]["visible"];
				break;
			}
		}
		if(wDymaticVisLayers.length === 0){ wDymaticVisLayers.push(-1);}
		wDymaticLayers.setVisibleLayers(wDymaticVisLayers);//设置地图中可视的图层
		return visibleindex;
	}

	//根据图层名称得到动图服务的图层
	this.getDymaticLayerByName = function(layerName) {
		var layerArr;
		var wDymaticLayers = map.getLayer(dymaticMapName);
		for(var i=0;i<wDymaticLayers.layerInfos.length;i++){
			if( wDymaticLayers.layerInfos[i].name == layerName ){
				layerArr = 	wDymaticLayers.layerInfos[i+1];
				break;
			}		
		}
		return layerArr;
	};
	//根据图层ID号码得到动图服务中的图层
	this.getDymaticLayerById = function(layerID) {
		var layerArr= new Array();
		var wDymaticLayers = map.getLayer(dymaticMapName);
		for(var i=0;i<wDymaticLayers.layerInfos.length;i++){
			if( wDymaticLayers.layerInfos[i].id == layerID ){
				layerArr = 	wDymaticLayers.layerInfos[i+1];
				break;
			}		
		}
		return layerArr;
	};
	//得到动图服务中所有的可视的图层
	this.getVisibleDymaticLayers = function(){
		var layerArr = new Array();
		var wDymaticLayers = map.getLayer(dymaticMapName);
		var wDymaticVisLayers = wDymaticLayers.visibleLayers;
		if(wDymaticVisLayers.length == 0) return  layerArr;
		for(var i=0;i<wDymaticVisLayers.length;i++){
			layerArr.push(this.getDymaticLayerById(wDymaticVisLayers[i]));
		}
		return layerArr;
				
	};
	//得到动图服务中所有的图层
	this.getAllDymaticLayers = function() {
		var layerArr= new Array();
		var wDymaticLayers = map.getLayer(dymaticMapName);		
		for(key in dymaticMap){
			layerArr.push(this.getDymaticLayerByName(dymaticMap[key].title));			
		}
		return layerArr;
	};
	//全图
	this.setFullMap = function() {
		navToolbar.zoomToFullExtent();
	};
	/*查询函数，第一个参数是查询的图层名称而不是ID号码，注意是个名称就是配置文件中的名称；
				第二个参数是根据几何查询时候的几何图形；
				第三个参数是查询的条件；
				第四个参数是回调函数，带着一个参数为featureSet类型*/
	this.query = function(layerName,geomety,condition,callback){
		if(condition=="") condition = "1=1";
		var queryLayer = this.getDymaticLayerByName(layerName);
		var wDymaticLayers = map.getLayer(dymaticMapName);
		var featureLayer = new esri.layers.FeatureLayer(wDymaticLayers.url +"/"+queryLayer.id,{outFields:["*"]});		
		var query = new esri.tasks.Query(); 
		if(geomety!=""){
			query.geometry = geomety;
		}	
		
		query.where = condition;  //"NAME = '" + stateName + "'";
		query.returnGeometry = true;
		//query.outFields = ["XMZBH","SQBH"];
		featureLayer.queryFeatures(query,callback);		
	};
	/*在地图上进行定位，第一个参数为显示的临时图层，
						第二个参数是featurelayer的geometry，
						第三个参数为透明度*/
	this.addGeoToCurrentMap = function(geom){		
		if( geom == "undefined" || geom =="") return;
		var graphy = null;
		if(geom.type == "point"){
			graphy = new esri.Graphic( geom, new esri.symbol.PictureMarkerSymbol('image/loc0.png',35, 50));
			map.centerAndZoom(geom,5);
			
		}
		else if(geom.type == "polyline "){
			graphy = new esri.Graphic( geom, new esri.symbol.SimpleLineSymbol("soild", new dojo.Color([255,0,0]),2)) ;
		}
		else if(geom.type == "polygon"){
			var symble = new esri.symbol.SimpleFillSymbol("cross", new esri.symbol.SimpleLineSymbol("soild", new dojo.Color([255,0,0]),2), new dojo.Color([255,255,0,0.25]));
			graphy = new esri.Graphic( geom, symble ) ;
			
			map.setExtent(geom.getExtent());
			
			
		}
		if(graphy == null) return;
		map.graphics.clear();
		map.graphics.add(graphy);
	};
	this.getMapCenterXY = function (){
		var mapXY =	targetMap.extent.getCenter();
		 return map.toScreen(mapXY);
	}
	this.getMapCenterPoint= function (){
		return	targetMap.extent.getCenter();		
	}
	this.clearMap = function(){
		targetMap.graphics.clear();
	}
}



	