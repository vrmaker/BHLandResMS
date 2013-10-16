/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-4-24
 * Time: 上午11:03
 * 文件功能描述：属性识别功能模块参数设置.
 */
dojo.require("esri.tasks.identify");

function IdentifyParametersHelper() {
    var targetIdentifyParameters = new esri.tasks.IdentifyParameters();

    ///<summary>识别查询参数</summary>
    ///<returns>IdentifyParameters</returns>
    this.identifyParameters = targetIdentifyParameters;

    ///<summary>分辨率</summary>
    ///<returns>Number</returns>
    this.dpi = function(myDpi) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.dpi;
        }
        else {
            targetIdentifyParameters.dpi = myDpi;
        }
    }

    ///<summary></summary>
    ///<returns>DynamicLayerInfos[]</returns>
    this.dynamicLayerInfos = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.dynamicLayerInfos;
        }
        else {
            targetIdentifyParameters.dynamicLayerInfos = value;
        }
    }

    ///<summary>实施识别的几何</summary>
    ///<returns>Geometry</returns>
    this.geometry = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.geometry;
        }
        else {
            targetIdentifyParameters.geometry = value;
        }
    }

    ///<summary>map的屏幕高度</summary>
    ///<returns>Number</returns>
    this.height = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.height;
        }
        else {
            targetIdentifyParameters.height = value;
        }
    }

    var _layerDefinitions;
    ///<summary>设置过滤图层条件</summary>
    ///<returns>String[]</returns>
    this.layerDefinitions = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.layerDefinitions;
        }
        else {
            _layerDefinitions = value;
            targetIdentifyParameters.layerDefinitions = value;
        }
    }

    ///<summary>指定要识别的图层id数组</summary>
    ///<returns>Number[]</returns>
    this.layerIds = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.layerIds;
        }
        else {
            targetIdentifyParameters.layerIds = value;
        }
    }

    ///<summary>对图层的选择设置，例如LAYER_OPTION_ALL、LAYER_OPTION_TOP、LAYER_OPTION_VISIBLE</summary>
    ///<returns>String</returns>
    this.layerOption = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.layerOption;
        }
        else {
            targetIdentifyParameters.layerOption = value;
        }
    }

    ///<summary>map的Extent</summary>
    ///<returns>Extent</returns>
    this.mapExtent = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.mapExtent;
        }
        else {
            targetIdentifyParameters.mapExtent = value;
        }
    }

    ///<summary>是否返回几何</summary>
    ///<returns>Boolean</returns>
    this.returnGeometry = function (value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.returnGeometry;
        }
        else {
            targetIdentifyParameters.returnGeometry = value;
        }
    }

    ///<summary>空间参考</summary>
    ///<returns>SpatialReference</returns>
    this.spatialReference = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.spatialReference;
        }
        else {
            targetIdentifyParameters.spatialReference = value;
        }
    }

    ///<summary>容差</summary>
    ///<returns>Number</returns>
    this.tolerance = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.tolerance;
        }
        else {
            targetIdentifyParameters.tolerance = value;
        }
    }

    ///<summary>map的屏幕宽度</summary>
    ///<returns>Number</returns>
    this.width = function(value) {
        if (arguments.length == 0) {
            return targetIdentifyParameters.width;
        }
        else {
            targetIdentifyParameters.width = value;
        }
    }

}