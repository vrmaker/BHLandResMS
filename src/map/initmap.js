/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-10
 * Time: 下午3:43
 * 地图入口.
 */


var initMap = function(){
    var mymap = new esri.Map("mapDiv");

     //var myTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://192.168.16.58/ArcGIS/rest/services/bhmap/MapServer");
    var myTiledMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost/ArcGIS/rest/services/world/MapServer");
    mymap.addLayer(myTiledMapServiceLayer);

//    var myTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("http://192.168.16.58/ArcGIS/rest/services/bhmap/MapServer");
//    //var myTiledMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost/ArcGIS/rest/services/world/MapServer");
//    mymap.addLayer(myTiledMapServiceLayer);
//
//    var mapLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://192.168.16.58/ArcGIS/rest/services/binhairoad2012/MapServer");
//    //var myTiledMapServiceLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost/ArcGIS/rest/services/world/MapServer");
//    mymap.addLayer(mapLayer);




}