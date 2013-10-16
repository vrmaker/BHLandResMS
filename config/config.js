/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-15
 * Time: 下午3:10
 * 配置 IP、地图服务.
 */
//此文件主要配置加载的切片、动态图层的信息、配置后台接口
var interfaceIP = "192.168.16.90";//后台接口的IP地址
var dymaticMapIp = "192.168.16.58";//动态图层的ip和服务名称
var dymaticMapName = "dymaticMap";
var featureLayerName = "featurelayer";//地图服务
var geometryName = "Geometry";

//切片图层的配置信息
var titleMap = {

    layer0:{
        "name": "影像图",//在页面中显示的名称
        "title":"tif10000",//服务名称,唯一
        "ip":"192.168.16.58",//服务ip
        "alpha":"1",//地图透明度
        "visible":0,//地图是否可视
        "layerId":"0",//在地图中的图层
        "icon":"image/m2_0.png"//图标的路径
    },
    layer1:{
        "name": "电子地图",//在页面中显示的名称
        "title":"bhmap",//服务名称
        "ip":"192.168.16.58",
        "alpha":"1",//地图透明度
        "visible":1,//地图是否可视
        "layerId":"0",//在地图中的图层
        "icon":"image/m1_1.png"//图标的路径
    },
    layer2:{
        "name": "路网",//在页面中显示的名称
        "title":"binhairoad2012",//服务名称
        "ip":"192.168.16.58",
        "alpha":"1",//地图透明度
        "visible":1,//地图是否可视
        "layerId":"0",//在地图中的图层
        "icon":"image/m1_1.png"//图标的路径
    }

};
//动态图层的配置信息
var dymaticMap = {
    layer0:{
        "name": "地名",//在页面中显示的名称
        "title":"地名",//在dymatic中层的名称
        "visible":1,//地图是否可视
        "icon":""//图标的路径
    },
    layer1:{
        "name": "规划条件",//在页面中显示的名称
        "title":"规划条件",//在dymatic中层的名称
        "visible":1,//地图是否可视
        "icon":""//图标的路径
    },
    layer2:{
        "name": "建设工程规划验收合格证",//在页面中显示的名称
        "title":"建设工程规划验收合格证",//在dymatic中层的名称
        "visible":0,//地图是否可视
        "icon":""//图标的路径
    },
    layer3:{
        "name": "选址意见书",//在页面中显示的名称
        "title":"选址意见书",//在dymatic中层的名称
        "visible":0,//地图是否可视
        "icon":""//图标的路径
    },
    layer4:{
        "name": "修建性详细规划",//在页面中显示的名称
        "title":"修建性详细规划",//在dymatic中层的名称
        "visible":0,//地图是否可视
        "icon":""//图标的路径
    },
    layer5:{
        "name": "核定用地图",//在页面中显示的名称
        "title":"核定用地图",//在dymatic中层的名称
        "visible":0,//地图是否可视
        "icon":""//图标的路径
    },
    layer6:{
        "name": "建设用地规划许可证",//在页面中显示的名称
        "title":"建设用地规划许可证",//在dymatic中层的名称
        "visible":0,//地图是否可视
        "icon":""//图标的路径
    },
    layer7:{
        "name": "控制性详细规划",//在页面中显示的名称
        "title":"控制性详细规划2013",//在dymatic中层的名称
        "visible":0,//地图是否可视
        "icon":""//图标的路径
    }
//    layer8:{
//        "name": "路网",//在页面中显示的名称
//        "title":"binhairoad2012",//服务名称
//        "ip":"192.168.16.58",
//        "visible":1,//地图是否可视
//        "icon":""//图标的路径
//    }
};

//切片图层的lods配置
var lodsMap = [
    {"level" : 0, "resolution" : 541.866666666667, "scale" : 2048000},
    {"level" : 1, "resolution" : 270.933333333333, "scale" : 1024000},
    {"level" : 2, "resolution" : 135.466666666667, "scale" : 512000},
    {"level" : 3, "resolution" : 67.7333333333333, "scale" : 256000},
    {"level" : 4, "resolution" : 33.8666666666667, "scale" : 128000},
    {"level" : 5, "resolution" : 16.9333333333333, "scale" : 64000},
    {"level" : 6, "resolution" : 8.46666666666667, "scale" : 32000},
    {"level" : 7, "resolution" : 4.23333333333333, "scale" : 16000},
    {"level" : 8, "resolution" : 2.11666666666667, "scale" : 8000},
    {"level" : 9, "resolution" : 1.05833333333333, "scale" : 4000},
    {"level" : 10, "resolution" : 0.529166666666667, "scale" : 2000}/*,
     {"level" : 11, "resolution" : 0.264583333333333, "scale" : 1000},
     {"level" : 12, "resolution" : 0.132291666666667, "scale" : 500}*/
];
// var lodsMap = [
// {"level" : 0, "resolution" : 264.583862501058, "scale" : 1000000},
// {"level" : 1, "resolution" : 132.291931250529, "scale" : 500000},
// {"level" : 2, "resolution" : 66.1459656252646, "scale" : 250000},
// {"level" : 3, "resolution" : 33.0729828126323, "scale" : 125000},
// {"level" : 4, "resolution" : 16.9333672000677, "scale" : 64000},
// {"level" : 5, "resolution" : 8.46668360003387, "scale" : 32000},
// {"level" : 6, "resolution" : 4.23334180001693, "scale" : 16000},
// {"level" : 7, "resolution" : 2.11667090000847, "scale" : 8000},
// {"level" : 8, "resolution" : 1.05833545000423, "scale" : 4000},
// {"level" : 9, "resolution" : 0.529167725002117, "scale" : 2000},
// {"level" : 10, "resolution" : 0.264583862501058, "scale" : 1000}
// ];