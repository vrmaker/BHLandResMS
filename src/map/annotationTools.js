/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-5-7
 * Time: 下午3:17
 * 文件功能描述：地图标注模块接口.
 */
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.toolbars.draw");
dojo.require("esri.tasks.query");
dojo.require("esri.dijit.editing.TemplatePicker-all");
dojo.require("esri.dijit.AttributeInspector-all");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
function AnnotationTools(map,pointLayer,lineLayer,PolygonLayer)
{
    var mymap = map;
    var annotationPointLayer = pointLayer;  //点要素层
    var annotationLineLayer = lineLayer;    //线要素层
    var annotationPolygonLayer = PolygonLayer;  //面要素层
    //var dyAnnotationLayer = dyLayer;

    var drawToolbar = null;
    var pointLayer = null;
    var polyLineLayer = null;
    var polygonLayer = null;
    var activePoint = false;    //是否正在画点
    var activePolyline = false; //是否正在画线
    var activePolygon = false; //是否正在画面
    var activeTemplatePicker = false;   //是否激活拾取组件
    var updateFeature = null;   //鼠标拾取到的层信息
    var newGraphic = null;  //鼠标画点、线、面后，需要添加的带有属性信息的新图层；也用于点击非鼠标拾取时的“保存”按钮时的更新属性信息
    var newObjectID = 0;    //返回的新添加到Feature层的几何体的ObjectID
    var queryResultEvent = null;    //鼠标点击查询事件的返回值
    var drawEndEvent = null;    //是否绘画结束；注：在绘画状态下，防止点击到已绘制几何体时触发拾取事件
    var panEvent = null;    //平移事件返回值
    var zoomEvent = null;   //缩放事件返回值
    var selectedTemplate = null;    //
    var pickLayer = null;   //拾取层
    var mapPoint = [];  //鼠标点击的地图坐标
    var isCancel = true;    //是否取消平移缩放操作；注：为解决点击“保存”后，平移、缩放时仍弹出Div问题
    var isClick = false;    //是否取消点击操作：注：理由同上
    var annotationPoint = null;     //点图层，用于绘制文字
    var annotationPolyline = null;  //线图层，用于绘制文字
    var annotationPolygon = null;   //面图层，用于绘制文字
    var lineSymbol = null;  //
    var picSymbol = null;   //
    var fillSymbol = null;  //
    var pointGraphicLayers = [];    //
    var polylineGraphicLayers = []; //
    var polygonGraphicLayers = [];  //
    var positionID = 0;         //标识Div位置,注：1：左上，2：右上，3：左下，4：右下
    var drawing = false; //正在画点标记,该标记为true时，取消点击属性查询功能

//    function __pf(){
//        var len = arguments.length;
//        for ( var i=0; i<len; i++) {
//            zzz.value += arguments[i]+"\r\n";
//        }
//        zzz.value += "-----------\r\n";
//    }

    this.initAnnotationTools = function()
    {
        drawToolbar = new esri.toolbars.Draw(mymap);

        dojo.connect(mymap, "onLayersAddResult", initAll);

        //dojo.connect(mymap,"onLayerAddResult",function(results){
            //layers = [annotationPointLayer,annotationLineLayer,annotationPolygonLayer];
       // });
        mymap.addLayers([annotationPolygonLayer,annotationLineLayer,annotationPointLayer]);

        drawEndEvent = dojo.connect(drawToolbar,"onDrawEnd",doAnnotation);

        isClick = true;
        //
        annotationPoint = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 2385 }));
        annotationPolyline = new esri.geometry.Polyline(new esri.SpatialReference({ wkid: 2385 }));
        annotationPolygon = new esri.geometry.Polygon(new esri.SpatialReference({wkid:2385}));

        picSymbol = new esri.symbol.PictureMarkerSymbol("image/an_point.png",12,12);
        lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,new dojo.Color([255,255,0]),2);
        fillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,0]), 2), new dojo.Color([255,0,0,0.20]));

    }

    this.hideShowAttributes = function()
    {
        $("#annotationAttrDiv").hide();
        isCancel = true;
    }
    this.removeFeatureLayer = function()
    {
        if(annotationPointLayer)
        {
            mymap.removeLayer(annotationPointLayer);
        }
        if(annotationLineLayer)
        {
            mymap.removeLayer(annotationLineLayer);
        }
        if(annotationPolygonLayer)
        {
            mymap.removeLayer(annotationPolygonLayer);
        }
        //dyAnnotationLayer.hide();
        mymap.graphics.clear();
        if($("#annotationAttrDiv").css("display")=="block"){
            $("#annotationAttrDiv").hide();
        }

        if(drawToolbar)
        {
            drawToolbar.deactivate();
            drawToolbar = null;
        }

        if(queryResultEvent)
        {
            dojo.disconnect(queryResultEvent);
            queryResultEvent = null;
        }
//        if(panEvent)
//        {
            dojo.disconnect(panEvent);
            panEvent = null;
        //}
//        if(zoomEvent)
//        {
            dojo.disconnect(zoomEvent);
            zoomEvent = null;
       // }
        isClick = false;
        isCancel = true;
        annotationPoint = null;
        annotationPolyline = null;
        annotationPolygon = null;

    }
    this.activeAnnotationPoint = function()
    {
        //先取消其它绘画操作
        drawToolbar.deactivate();
        drawing = true;
        pickLayer = pointLayer;
        drawToolbar.activate(esri.toolbars.Draw.POINT);
    }
    this.activeAnnotationPolyLine = function()
    {
        //先取消其它绘画操作
        drawToolbar.deactivate();
        drawing = true;
        pickLayer = polyLineLayer;
        drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
    }
    this.activeAnnotationPolygon = function()
    {
        //先取消其它绘画操作
        drawToolbar.deactivate();
        drawing = true;
        pickLayer = polygonLayer;
        drawToolbar.activate(esri.toolbars.Draw.POLYGON);
    }
    this.showPicker = function()
    {
		setDivDisplay("pickerContainer");
        templatePicker.clearSelection();

        //取消默认画点、画线、画面操作
        drawToolbar.deactivate();

        //templatePicker.attr("featureLayers", [pickLayer]);
       
        //templatePicker.update();
    }

    this.saveAttribute = function()
    {
        //取消平移、缩放操作
        if(panEvent)
        {
            isCancel = true;
            dojo.disconnect(panEvent);
            dojo.disconnect(panEvent);
            console.log(panEvent);
        }
        if(zoomEvent)
        {
            dojo.disconnect(zoomEvent);
        }
        //add时点击保存
        if(newGraphic)
        {
            var id = newGraphic.attributes.C0;
        }

        var value0 = Ext.getCmp("name-field").getValue();
        var value1 = Ext.getCmp("remark-field").getValue();

        var addFeatureAttr = {"C0":id,"C1":value0,"C2":value1,"OBJECTID":newObjectID};

        if(activePoint)
        {
            activePoint = false;
            newGraphic.setAttributes(addFeatureAttr);
            newGraphic.getLayer().applyEdits(null, [newGraphic], null);

//
//            for(var i=0;i<pointGraphicLayers.length;i++)
//            {
//                if(addFeatureAttr.OBJECTID == pointGraphicLayers[i].OBJECTID)
//                {
//                    pointGraphicLayers[i].annotationGraphics.symbol.text = value0;
//                    mymap.graphics.redraw();
//                }
//            }
            var font = new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Helvetica");
            var textSymbol = new esri.symbol.TextSymbol("Hello World",font,new dojo.Color("#ef6565"));
            textSymbol.setOffset(0,10);
            textSymbol.setText(value0);
            var annotationPointGraphic = new esri.Graphic(annotationPoint,textSymbol);
            mymap.graphics.add(annotationPointGraphic);
            var graphicObject = {};
            graphicObject.OBJECTID = addFeatureAttr.OBJECTID;
            graphicObject.annotationGraphics = annotationPointGraphic;
            pointGraphicLayers.push(graphicObject);

        }
        else if(activePolyline)
        {
            newGraphic.setAttributes(addFeatureAttr);
            newGraphic.getLayer().applyEdits(null, [newGraphic], null);
            activePolyline = false;

//            for(var i=0;i<polylineGraphicLayers.length;i++)
//            {
//                if(addFeatureAttr.OBJECTID == polylineGraphicLayers[i].OBJECTID)
//                {
//                    polylineGraphicLayers[i].annotationGraphics.symbol.text = value0;
//                    mymap.graphics.redraw();
//                }
//            }
            var font = new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Helvetica");
            var textSymbol = new esri.symbol.TextSymbol("Hello World",font,new dojo.Color("#ef6565"));
            textSymbol.setOffset(0,10);
            var annoPoint = annotationPolyline.getPoint(0,annotationPolyline.paths[0].length-1);
            textSymbol.setText(value0);
            var annotationPolylineGraphic = new esri.Graphic(annoPoint,textSymbol);

            mymap.graphics.add(annotationPolylineGraphic);
            var graphicObject = {};
            graphicObject.OBJECTID = addFeatureAttr.OBJECTID;
            graphicObject.annotationGraphics = annotationPolylineGraphic;
            polylineGraphicLayers.push(graphicObject);
        }
        else if(activePolygon)
        {
            newGraphic.setAttributes(addFeatureAttr);
            newGraphic.getLayer().applyEdits(null,  [newGraphic],null);
            activePolygon = false;

//            for(var i=0;i<polygonGraphicLayers.length;i++)
//            {
//                if(addFeatureAttr.OBJECTID == polygonGraphicLayers[i].OBJECTID)
//                {
//                    polygonGraphicLayers[i].annotationGraphics.symbol.text = value0;
//                    mymap.graphics.redraw();
//                }
//            }
            var font = new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Helvetica");
            var textSymbol = new esri.symbol.TextSymbol("Hello World",font,new dojo.Color("#ef6565"));
            textSymbol.setOffset(0,10);
            var annoPoint = annotationPolygon.getExtent().getCenter();
            textSymbol.setText(value0);
            var annotationPolygonGraphic= new esri.Graphic(annoPoint,textSymbol);
            mymap.graphics.add(annotationPolygonGraphic);
            var graphicObject = {};
            graphicObject.OBJECTID = addFeatureAttr.OBJECTID;
            graphicObject.annotationGraphics = annotationPolygonGraphic;
            polygonGraphicLayers.push(graphicObject);
        }
        else
        {
            //update
            updateFeature.attributes["C1"] = Ext.getCmp("name-field").getValue();
            updateFeature.attributes["C2"] = Ext.getCmp("remark-field").getValue();

            //更新textSymbol
            if(updateFeature.geometry.type == "point")
            {
                for(var i=0;i<pointGraphicLayers.length;i++)
                {
                    if(updateFeature.attributes.OBJECTID == pointGraphicLayers[i].OBJECTID)
                    {
                        pointGraphicLayers[i].annotationGraphics.symbol.text = value0;
                        mymap.graphics.redraw();
                    }
                }
            }
            if(updateFeature.geometry.type == "polyline")
            {
                for(var i=0;i<polylineGraphicLayers.length;i++)
                {
                    if(updateFeature.attributes.OBJECTID == polylineGraphicLayers[i].OBJECTID)
                    {
                        polylineGraphicLayers[i].annotationGraphics.symbol.text = value0;
                        mymap.graphics.redraw();
                    }
                }
            }
            if(updateFeature.geometry.type == "polygon")
            {
                for(var i=0;i<polygonGraphicLayers.length;i++)
                {
                    if(updateFeature.attributes.OBJECTID == polygonGraphicLayers[i].OBJECTID)
                    {
                        polygonGraphicLayers[i].annotationGraphics.symbol.text = value0;
                        mymap.graphics.redraw();
                    }
                }
            }

            updateFeature.getLayer().applyEdits(null, [updateFeature], null);
            updateFeature = null;
        }
        //setDivHide("annotationAttrDiv");

    }
    this.deleteAttribute = function()
    {
        //取消平移、缩放操作
        if(panEvent)
        {
            isCancel = true;
            dojo.disconnect(panEvent);
        }
        if(zoomEvent)
        {
            dojo.disconnect(zoomEvent);
        }

        var value0 = Ext.getCmp("name-field").getValue();
        var value1 = Ext.getCmp("remark-field").getValue();

        var addFeatureAttr = {"C1":value0,"C2":value1,"OBJECTID":newObjectID};

        if(activePoint)
        {
            newGraphic.setAttributes(addFeatureAttr);
            newGraphic.getLayer().applyEdits(null, null, [newGraphic]);
            activePoint = false;
        }
        else if(activePolyline)
        {
            newGraphic.setAttributes(addFeatureAttr);
            newGraphic.getLayer().applyEdits(null, null, [newGraphic]);
            activePolyline = false;
        }
        else if(activePolygon)
        {
            newGraphic.setAttributes(addFeatureAttr);
            newGraphic.getLayer().applyEdits(null,null, [newGraphic],function(e)
            {

                console.log(e);
            });
            activePolygon = false;
        }
        else
        {
            updateFeature.getLayer().applyEdits(null, null,[updateFeature],null,function(e)
            {

                console.log(e);
            });
            if(updateFeature.geometry.type == "point")
            {
                for(var i=0;i<pointGraphicLayers.length;i++)
                {
                    if(updateFeature.attributes.OBJECTID == pointGraphicLayers[i].OBJECTID)
                    {
                        mymap.graphics.remove(pointGraphicLayers[i].annotationGraphics);
                    }
                }
            }
            if(updateFeature.geometry.type == "polyline")
            {
                for(var i=0;i<polylineGraphicLayers.length;i++)
                {
                    if(updateFeature.attributes.OBJECTID == polylineGraphicLayers[i].OBJECTID)
                    {
                        mymap.graphics.remove(polylineGraphicLayers[i].annotationGraphics);
                    }
                }
            }
            if(updateFeature.geometry.type == "polygon")
            {
                for(var i=0;i<polygonGraphicLayers.length;i++)
                {
                    if(updateFeature.attributes.OBJECTID == polygonGraphicLayers[i].OBJECTID)
                    {
                        mymap.graphics.remove(polygonGraphicLayers[i].annotationGraphics);
                    }
                }
            }

        }
        //setDivHide("annotationAttrDiv");

    }

    initAll = function(results)
    {
        initTextGraphics(results);
        initEditor(results);
        initAttrInspector(results);
        //genernatePickerList();
    }
    initTextGraphics = function(results)
    {
        for(var i=0;i<results.length;i++)
        {
            var selectedFL = results[i].layer;
            var selectQuery = new esri.tasks.Query();

            selectQuery.geometry = new esri.geometry.Extent(0,0,2141938,4277182,new esri.SpatialReference({wkid:2385}));
            selectedFL.selectFeatures(selectQuery, esri.layers.FeatureLayer.SELECTION_NEW, function(features) {
                if (features.length > 0) {
                    for(var i = 0;i<features.length;i++)
                    {
                        var featureGeometry = features[i];
                        addTextGraphics(featureGeometry);
                    }


                } else{
                }
            });
        }
    }
    addTextGraphics = function(geo)
    {
        if(geo.geometry.type == "point")
        {
            var font = new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Helvetica");
            var textSymbol = new esri.symbol.TextSymbol("Hello World",font,new dojo.Color("#ef6565"));
            textSymbol.setOffset(0,10);
            if(geo.attributes.C1)
            {
                textSymbol.setText(geo.attributes.C1);
            }
            else{
                textSymbol.setText("");
            }
            var annotationPointGraphic = new esri.Graphic(geo.geometry,textSymbol);
            mymap.graphics.add(annotationPointGraphic);
            var graphicObject = {};
            graphicObject.OBJECTID = geo.attributes.OBJECTID;
            graphicObject.annotationGraphics = annotationPointGraphic;
            pointGraphicLayers.push(graphicObject);
        }
        if(geo.geometry.type == "polyline")
        {
            var font = new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Helvetica");
            var textSymbol = new esri.symbol.TextSymbol("Hello World",font,new dojo.Color("#ef6565"));
            textSymbol.setOffset(0,10);
            var annoPoint = geo.geometry.getPoint(0,geo.geometry.paths[0].length-1);
            if(geo.attributes.C1)
            {
                textSymbol.setText(geo.attributes.C1);
            }
            else{
                textSymbol.setText("");
            }
            var annotationPolylineGraphic = new esri.Graphic(annoPoint,textSymbol);

            mymap.graphics.add(annotationPolylineGraphic);
            var graphicObject = {};
            graphicObject.OBJECTID = geo.attributes.OBJECTID;
            graphicObject.annotationGraphics = annotationPolylineGraphic;
            polylineGraphicLayers.push(graphicObject);
        }
        if(geo.geometry.type == "polygon")
        {
            var font = new esri.symbol.Font("10pt",esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Helvetica");
            var textSymbol = new esri.symbol.TextSymbol("Hello World",font,new dojo.Color("#ef6565"));
            textSymbol.setOffset(0,10);
            var annoPoint = geo.geometry.getExtent().getCenter();
            if(geo.attributes.C1)
            {
                textSymbol.setText(geo.attributes.C1);
            }
            else{
                textSymbol.setText("");
            }
            var annotationPolygonGraphic= new esri.Graphic(annoPoint,textSymbol);
            mymap.graphics.add(annotationPolygonGraphic);

            var graphicObject = {};
            graphicObject.OBJECTID = geo.attributes.OBJECTID;
            graphicObject.annotationGraphics = annotationPolygonGraphic;
            polygonGraphicLayers.push(graphicObject);
        }
    }
    var layers = null;
    initEditor = function(results)
    {
        layers = dojo.map(results, function(result) {
            return result.layer;
        });
        for(var i=0;i<layers.length;i++)
        {
            if(layers[i].type == "Feature Layer" && layers[i].geometryType == "esriGeometryPoint")
            {
                pointLayer = layers[i];
            }
            if(layers[i].type == "Feature Layer" && layers[i].geometryType == "esriGeometryPolyline")
            {
                polyLineLayer = layers[i];
            }
            if(layers[i].type == "Feature Layer" && layers[i].geometryType == "esriGeometryPolygon")
            {
                polygonLayer = layers[i];
            }
        }
    }

    var templatePicker = null;
    genernatePickerList = function()
    {
        //赋一个默认值
        templatePicker = new esri.dijit.editing.TemplatePicker({
            featureLayers: layers,
            rows: "auto",
            columns:"auto",
            grouping: true,
            showTooltip:false,
            style:"height:100%;overflow:hidden;border;none;"
        }, "templatePickerDiv");

        templatePicker.startup();

        //需要先显示，后设置隐藏!!!
        setDivHide("pickerContainer");

        dojo.connect(templatePicker, "onSelectionChange", function() {
            //激活从详细列表中选择
            activeTemplatePicker = true;
            drawing = true;
            console.log("drawing",drawing);

            if(templatePicker.getSelected()){
                selectedTemplate = templatePicker.getSelected();
            }
            switch (selectedTemplate.featureLayer.geometryType) {
                case "esriGeometryPoint":
                    drawToolbar.activate(esri.toolbars.Draw.POINT);
                    break;
                case "esriGeometryPolyline":
                    drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
                    break;
                case "esriGeometryPolygon":
                    drawToolbar.activate(esri.toolbars.Draw.POLYGON);
                    break;
            }
        });
    }
    this.destroyDetailList = function()
    {
        drawToolbar.deactivate();
        //setDivHide("pickerContainer");

    }
    initAttrInspector = function(results)
    {
        queryResultEvent = dojo.connect(mymap, "onClick", function(evt){

            console.log("---------onClick------------",evt.mapPoint);

            var screenPtX = new esri.geometry.Point(0,0);
            var screenPtY = new esri.geometry.Point(1,0);

            var mapPtX = mymap.toMap(screenPtX);
            var mapPtY = mymap.toMap(screenPtY);
            var distance = mapPtY.x - mapPtX.x;
            distance *= 10;
            for(var i=0;i<results.length;i++)
            {
                var selectedFL = results[i].layer;
                var selectQuery = new esri.tasks.Query();

                mapPoint = evt.mapPoint;
                var selectExtent = new esri.geometry.Extent(mapPoint.x-distance,mapPoint.y-distance,mapPoint.x+distance,mapPoint.y+distance, new esri.SpatialReference({ wkid:2385 }))
                selectQuery.geometry = selectExtent;
                selectedFL.selectFeatures(selectQuery, esri.layers.FeatureLayer.SELECTION_NEW, function(features) {
                    if (features.length > 0 && !drawing) { //当查询到结果并且不是在绘画过程中，误点已绘制出的点线面时查询
                        //store the current feature
                        updateFeature = features[0];
                        showAttribute(updateFeature.geometry,updateFeature.attributes);
                        isCancel = false;

                    } else{
                    }
                });
            }
        });

    }

    showAttribute = function(geometry,attributes)
    {
        AnnotationMsgWnd.create();
        AnnotationMsgWnd.show();
        var field1 = Ext.getCmp("name-field");
        field1.setValue(attributes["C1"]);
        var field2 = Ext.getCmp("remark-field");
        field2.setValue(attributes["C2"]);
//        console.log("-----showAttribute------");
//        setInputValue("value0",attributes["C1"]);
//        setInputValue("value1",attributes["C2"]);
//
//        panEvent = dojo.connect(mymap,"onPan",function(extent,delta){
//            var currScreenPt = [];
//            screenPt = mymap.toScreen(mapPoint);
//            currScreenPt.x= screenPt.x + delta.x;
//            currScreenPt.y = screenPt.y + delta.y;
//            if(isCancel == false)
//            {
//                setChangedDivPosition(currScreenPt);
//            }
//
//        });
//
//        zoomEvent = dojo.connect(mymap,"onZoomEnd",function(extent, zoomFactor, anchor){
//            var currScreenPt = [];
//            screenPt = mymap.toScreen(mapPoint);
//            currScreenPt.x= screenPt.x ;
//            currScreenPt.y = screenPt.y ;
//            if(!isCancel)
//            {
//                setChangedDivPosition(currScreenPt);
//            }
//        })
//
//        screenPt = mymap.toScreen(mapPoint);
//        if(isClick)
//        {
//            setClickDivPosition(screenPt);
//        }

    }
    var screenPt = [0,0];
    doAnnotation = function(geometry)
    {
        //Div随地图移动
        isCancel = false;
        drawing = false;
        console.log("drawing",drawing);
        drawToolbar.deactivate();

        var attributes = {"C1":"","C2":""};

        switch(geometry.type)
        {
            case "point":
            {
                annotationPoint = geometry;
                if(!activeTemplatePicker)
                {
                    newGraphic = new esri.Graphic(geometry,null,attributes);
                    pointLayer.applyEdits([newGraphic],null,null,addResults);
                }
                else
                {
                    activeTemplatePicker = false;
                    templatePicker.clearSelection();
                    drawToolbar.deactivate();
                    attributes = dojo.mixin({},selectedTemplate.template.prototype.attributes);
                    newGraphic = new esri.Graphic(geometry,null,attributes);
                    selectedTemplate.featureLayer.applyEdits([newGraphic], null, null,addResults);
                }
                activePoint = true;
                showAttribute(geometry,attributes);
                break;
            }
            case "polyline":
            {
                annotationPolyline = geometry;
                if(!activeTemplatePicker)
                {
                    newGraphic = new esri.Graphic(geometry,null,attributes);
                    polyLineLayer.applyEdits([newGraphic],null,null,addResults);
                }
                else
                {
                    activeTemplatePicker = false;
                    templatePicker.clearSelection();
                    drawToolbar.deactivate();
                    attributes = dojo.mixin({},selectedTemplate.template.prototype.attributes);
                    newGraphic = new esri.Graphic(geometry,null,attributes);
                    selectedTemplate.featureLayer.applyEdits([newGraphic], null,null, addResults);
                }
                activePolyline = true;
                showAttribute(geometry,attributes);
                break;
            }
            case "polygon":
            {
                annotationPolygon = geometry;
                if(!activeTemplatePicker)
                {
                    newGraphic = new esri.Graphic(geometry,null,attributes);
                    polygonLayer.applyEdits([newGraphic],null,null,addResults);
                }
                else
                {
                    activeTemplatePicker = false;
                    templatePicker.clearSelection();
                    drawToolbar.deactivate();
                    attributes = dojo.mixin({},selectedTemplate.template.prototype.attributes);
                    newGraphic = new esri.Graphic(geometry,null,attributes);
                    selectedTemplate.featureLayer.applyEdits([newGraphic], null, null,addResults);

                }
                activePolygon = true;
                showAttribute(geometry,attributes);
                break;
            }
        }

    }
    addResults = function(res)
    {
        console.log(res);
        newObjectID = res[0].objectId;
    }

    this.deactiveAnnotation = function()
    {
        dojo.disconnect(queryResultEvent);
    }

    setDivHide = function(divId)
    {
        var annotationDiv = document.getElementById(divId);
        annotationDiv.style.display = "none";
    }
    setDivDisplay = function(divId)
    {
        var annotationDiv = document.getElementById(divId);
        annotationDiv.style.display = "block";
    }

    setClickDivPosition = function(screenPt)
    {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        var divWidth = $("#annotationAttrDiv").width();
        var divHeight = $("#annotationAttrDiv").height();

        var annotationDiv = document.getElementById("annotationAttrDiv");

        //左上
        if(screenPt.x < screenWidth/2 && screenPt.y <= screenHeight/2)
        {
            positionID = 1;
            annotationDiv.style.left = screenPt.x +"px";
            annotationDiv.style.top = screenPt.y + "px";
        }
        //右上
        else if(screenPt.x >= screenWidth/2 && screenPt.y <= screenHeight/2)
        {
            positionID = 2;
            annotationDiv.style.left = (screenPt.x - divWidth) +"px";
            annotationDiv.style.top = screenPt.y  + "px";
        }
        //左下
        else if(screenPt.x < screenWidth/2 && screenPt.y > screenHeight/2)
        {
            positionID = 3;
            annotationDiv.style.left = screenPt.x +"px";
            annotationDiv.style.top = (screenPt.y - divHeight) + "px";
        }
        //右下
        else if(screenPt.x >= screenWidth/2 && screenPt.y > screenHeight/2)
        {
            positionID = 4;
            annotationDiv.style.left = (screenPt.x - divWidth) +"px";
            annotationDiv.style.top = (screenPt.y - divHeight) + "px";
        }
        else{

        }

        annotationDiv.style.display = "block";
    }
    setChangedDivPosition = function(screenPt)
    {
        var divWidth = $("#annotationAttrDiv").width();
        var divHeight = $("#annotationAttrDiv").height();

        var annotationDiv = document.getElementById("annotationAttrDiv");
        //左上
        if(positionID == 1)
        {
            annotationDiv.style.left = screenPt.x +"px";
            annotationDiv.style.top = screenPt.y + "px";
        }
        //右上
        else if( positionID == 2)
        {
            annotationDiv.style.left = (screenPt.x - divWidth) +"px";
            annotationDiv.style.top = screenPt.y  + "px";
        }
        //左下
        else if(positionID == 3)
        {
            annotationDiv.style.left = screenPt.x +"px";
            annotationDiv.style.top = (screenPt.y - divHeight) + "px";
        }
        //右下
        else if(positionID == 4)
        {
            annotationDiv.style.left = (screenPt.x - divWidth) +"px";
            annotationDiv.style.top = (screenPt.y - divHeight) + "px";
        }
        else{

        }

        annotationDiv.style.display = "block";
    }
    setInputValue = function(inputId,value)
    {
        var inputValue = document.getElementById(inputId);
        inputValue.value = value;
    }
    getInputValue = function(inputId)
    {
        var inputValue = document.getElementById(inputId);
        return inputValue.value;
    }
}


