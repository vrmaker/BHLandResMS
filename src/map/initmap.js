/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-10
 * Time: 下午3:43
 * 地图入口.
 */
var gMapHelper = null;
var measureTools = null;
var identifyTaskHelper = null;
var annotationTools = null;
var findTaskHandler = null;
var mymap = null;

var initMap = function(){
    mymap = new esri.Map("mapDiv",{zoom:1});

//     var myTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://192.168.16.58/ArcGIS/rest/services/bhmap/MapServer");
//    //var myTiledMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost/ArcGIS/rest/services/world/MapServer");
//    mymap.addLayer(myTiledMapServiceLayer);

//    var myTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://192.168.16.58/ArcGIS/rest/services/bhmap/MapServer");
//    mymap.addLayer(myTiledMapServiceLayer);
//
//    var mapLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://192.168.16.58/ArcGIS/rest/services/binhairoad2012/MapServer");
//    mymap.addLayer(mapLayer);

    gMapHelper = new MapHelper(mymap);
    gMapHelper.addArcGISTiledMapServiceLayer();
    gMapHelper.addArcGISDynamicMapServiceLayer();

    //加入动态地图,使动态图层可视
    var wDymaticLayers = mymap.getLayer(dymaticMapName);
    dojo.connect(wDymaticLayers, "onLoad", initDymaticMapVisible);
    function initDymaticMapVisible(wDymaticLayers){
        var  wInitLayer = new Array();
        for(key in dymaticMap){
            for(var i=0;i<wDymaticLayers.layerInfos.length;i++){
                if(dymaticMap[key].title == wDymaticLayers.layerInfos[i].name){
                    if(dymaticMap[key]["visible"] == 1){
                        wInitLayer.push(wDymaticLayers.layerInfos[i].id);
                    }
                    break;
                }
            }
        }
        wDymaticLayers.visibleLayers.splice(0,wDymaticLayers.visibleLayers.length);//
        wDymaticLayers.setVisibleLayers(wInitLayer);

    }

    //测量工具
    measureTools = new MeasureTools(mymap);
    measureTools.initMeasureTools();
    //属性识别
    identifyTaskHelper = new IdentifyTasks();
    identifyTaskHelper.identifyHandler(mymap);

    //地图标注
    var annotationPointLayer = new esri.layers.FeatureLayer("http://" + dymaticMapIp + "/ArcGIS/rest/services/" + featureLayerName + "/FeatureServer/1", {
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["C1","C2"]
    });
    var annotationLineLayer = new esri.layers.FeatureLayer("http://" + dymaticMapIp + "/ArcGIS/rest/services/" + featureLayerName + "/FeatureServer/2", {
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["C1","C2"]
    });
    var annotationPolygonLayer = new esri.layers.FeatureLayer("http://" + dymaticMapIp + "/ArcGIS/rest/services/" + featureLayerName + "/FeatureServer/3", {
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["C1","C2"]
    });

    //地图定位
    findTaskHandler = new FindTasks();

    //地图标注
    annotationTools = new AnnotationTools(mymap,annotationPointLayer,annotationLineLayer,annotationPolygonLayer);
}