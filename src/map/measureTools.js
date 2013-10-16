/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-4-22
 * Time: 上午10:39
 * 文件功能描述：测量距离、面积
 */
dojo.require("esri.toolbars.draw");
dojo.require("esri.tasks.geometry");
//dojo.require("dijit.form.Slider");

MeasureTools = function(mymap )
{
    var mymap = mymap;

    var geometryService = null;
    var inPoint = null;     //点对象
    var inPolygon = null;   //线对象
    var inPolyline = null;  //面对象
    var inPointGraphic = null;      //点图层
    var inPolylineGraphic = null;   //线图层
    var inPolygonGraphic = null;    //面图层
    var distance = null;            //距离
    var area = null;                //面积

    var lineSymbol = null;          //线标
    var picSymbol = null;           //点标
    var fillSymbol = null;          //面标
    var clickLengthEvent = null;    //点击测距事件返回值，注：用于清空上次测距或测面积的结果值
    var clickAreaEvent = null;      //点击测面积事件返回值，注：用于清空上次测距或测面积的结果值

    MeasureTools.prototype.initMeasureTools = function()
    {
        geometryService = new esri.tasks.GeometryService("http://"+dymaticMapIp+"/ArcGIS/rest/services/"+geometryName+"/GeometryServer");

        dojo.connect(geometryService, "onLengthsComplete", this.outputDistance);
        dojo.connect(geometryService, "onAreasAndLengthsComplete", this.outputAreaAndLength);

        inPoint = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 2385 }));
        inPolyline = new esri.geometry.Polyline(new esri.SpatialReference({ wkid: 2385 }));
        inPolygon = new esri.geometry.Polygon(new esri.SpatialReference({wkid:2385}));

        picSymbol = new esri.symbol.PictureMarkerSymbol("resources/landres/img/flagDot.png",12,12);
        lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,255,0]),2);
        fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,0]), 2), new dojo.Color([255,0,0,0.20]));

        inPointGraphic = new esri.Graphic(inPoint,picSymbol);
        inPolylineGraphic = new esri.Graphic(inPolyline,lineSymbol);
        inPolygonGraphic= new esri.Graphic(inPolygon,fillSymbol);

    }

    MeasureTools.prototype.addPolyline = function(evt)
    {

        if(inPolygon.rings.length > 0)
        {
            inPoint.points = [];
            inPolygon.rings = [];
            mymap.graphics.clear();
        }
        inPoint.addPoint([evt.mapPoint.x,evt.mapPoint.y]);
        inPolyline.addPath(inPoint.points);
        drawPolyline();

    }
    MeasureTools.prototype.addPolygon = function(evt)
    {
        var length = inPolyline.paths.length;
        if( length > 0)
        {
            console.log(inPolyline);
            inPoint.points = [];
            inPolyline.paths = [];
            mymap.graphics.clear();
        }

        inPoint.addPoint(new esri.geometry.Point(evt.mapPoint.x,evt.mapPoint.y));
        inPolygon.addRing(inPoint.points);

        drawPolygon();

    }
    drawPolyline = function()
    {
        mymap.graphics.clear();
        mymap.graphics.add(inPointGraphic);
        mymap.graphics.add(inPolylineGraphic);

        measureLength();
    }
    drawPolygon = function()
    {
        //只留最后一个环
        for(var index = 0;index < inPolygon.rings.length-1;index++)
        {
            inPolygon.removeRing(index);
        }
        var length = inPolygon.rings[0].length;
        inPolygon.rings[0][length] = inPolygon.rings[0][0];

        mymap.graphics.clear();
        mymap.graphics.add(inPointGraphic);
        mymap.graphics.add(inPolygonGraphic);

        measurePolygon();
    }
    measureLength = function()
    {
        var lengthParams = new esri.tasks.LengthsParameters();
        lengthParams.polylines = [inPolyline];
        lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
        lengthParams.geodesic = true;
        geometryService.lengths(lengthParams);
    }
    measurePolygon = function()
    {
        //面积
        var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
        areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
        areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_KILOMETERS;
        geometryService.simplify([inPolygon], function(simplifiedGeometries) {
            areasAndLengthParams.polygons = simplifiedGeometries;
            geometryService.areasAndLengths(areasAndLengthParams);
        });
    }

    undoPoint = function(undoAmount)
    {
        if(inPoint.points.length > 0)
        {
            for(var index = 0;index < undoAmount;index++)
            {
                inPoint.points.pop();
            }
        }
    }
    undoPolyline = function(undoAmount)
    {
        undoPoint(undoAmount);

        if(inPolyline.paths.length > 0)
        {
            for(var index = 0;index < undoAmount;index++)
            {
                inPolyline.paths.pop();
            }
            mymap.graphics.redraw();
        }
        measureLength();

    }
    undoPolygon = function(undoAmount)
    {
        undoPoint(undoAmount);

        var length = inPolygon.rings[0].length;
        if(length > 0)
        {
            for(var index = 0;index < undoAmount;index++)
            {
                //清除倒数第二个点
                var newArray = new Array(inPolygon.rings[0][length-1][0],inPolygon.rings[0][length-1][1]);
                inPolygon.rings[0] = inPolygon.rings[0].slice(0,length-2);
                inPolygon.rings[0].push(newArray);
            }
            mymap.graphics.redraw();
        }

        measurePolygon();

    }
    //显示测量距离
    MeasureTools.prototype.outputDistance = function(result)
    {
        var length = result.lengths.length;
        distance = result.lengths[length-1].toFixed(4);

        var lenField = Ext.getCmp("result-field");
        lenField.setValue(distance + "千米");

        //console.log("distance",distance);
    }
    MeasureTools.prototype.getDistance = function(){
        return distance;
    }

//显示测量面积
    MeasureTools.prototype.outputAreaAndLength = function(result)
    {
        var length = result.areas.length;
        area = result.areas[length-1].toFixed(4);

        var areaField = Ext.getCmp("result-field");
        areaField.setValue(area + "千米");
    }

    MeasureTools.prototype.rollback = function()
    {
        this.deactiveEvent();
        if(inPolyline.paths.length > 0)
        {
            undoPolyline(1);
            clickLengthEvent = dojo.connect(mymap,"onClick",this.addPolyline);
        }
        if(inPolygon.rings.length > 0)
        {
            undoPolygon(1);
            clickAreaEvent = dojo.connect(mymap,"onClick",this.addPolygon);
        }
    }
    var isLength = false;
    var isArea = false;
    MeasureTools.prototype.clearAll = function()
    {
        this.deactiveEvent();
        if(inPolyline.paths.length > 0)
        {
            isLength = true;
        }
        if(inPolygon.rings.length > 0)
        {
            isArea = true;
        }

        inPoint.points = [];
        inPolyline.paths = [];
        inPolygon.rings = [];
        mymap.graphics.clear();

        if(isLength)
        {
            measureLength();
            isLength = false;
            clickLengthEvent = dojo.connect(mymap,"onClick",this.addPolyline);
        }
        if(isArea)
        {
            measurePolygon();
            isArea = false;
            clickAreaEvent = dojo.connect(mymap,"onClick",this.addPolygon);
        }



        this.deactiveEvent();
    }
    MeasureTools.prototype.activeMeasureLength = function()
    {
        this.deactiveEvent();

        clickLengthEvent = dojo.connect(mymap,"onClick",this.addPolyline);

    }

    MeasureTools.prototype.activeMeasureArea = function()
    {
        this.deactiveEvent();
        clickAreaEvent = dojo.connect(mymap,"onClick",this.addPolygon);

    }

    MeasureTools.prototype.deactiveEvent = function()
    {
        if(clickAreaEvent)
        {
            dojo.disconnect(clickAreaEvent);
            clickAreaEvent = null;
        }
        if(clickLengthEvent)
        {
            dojo.disconnect(clickLengthEvent);
            clickLengthEvent = null;
        }
    }

}
