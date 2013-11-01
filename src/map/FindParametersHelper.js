/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-4-24
 * Time: 下午4:11
 * 地名点定位功能模块参数设置.
 */

dojo.require("esri.tasks.find");

function DistFindParametersHelper() {
    var targetFindParameters = new esri.tasks.FindParameters();

    ///<summary>识别查询参数</summary>
    ///<returns>FindParameters</returns>
    this.findParameters = targetFindParameters;

    ///<summary>是否模糊查询</summary>
    ///<returns>Boolean</returns>
    this.contains = function (myContains) {
        if (arguments.length == 0) {
            return targetFindParameters.contains;
        }
        else {
            targetFindParameters.contains = myContains;
        }
    }

    ///<summary></summary>
    ///<returns>DynamicLayerInfos[]</returns>
    this.dynamicLayerInfos = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.dynamicLayerInfos;
        }
        else {
            targetFindParameters.dynamicLayerInfos = value;
        }
    }


    ///<summary>设置过滤图层条件</summary>
    this.layerDefinitions = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.layerDefinitions;
        }
        else {
            targetFindParameters.layerDefinitions = value;
        }
    }

    ///<summary>指定要查找的图层id数组</summary>
    this.layerIds = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.layerIds;
        }
        else {
            targetFindParameters.layerIds = value;
        }
    }

    ///<summary>最大允许偏移量</summary>
    this.maxAllowableOffset = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.maxAllowableOffset;
        }
        else {
            targetFindParameters.maxAllowableOffset = value;
        }
    }

    ///<summary>输出几何的空间参考</summary>
    this.outSpatialReference = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.outSpatialReference;
        }
        else {
            targetFindParameters.outSpatialReference = value;
        }
    }

    ///<summary>是否返回几何</summary>
    this.returnGeometry = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.returnGeometry;
        }
        else {
            targetFindParameters.returnGeometry = value;
        }
    }

    ///<summary>指定查找字段</summary>
    this.searchFields = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.searchFields;
        }
        else {
            targetFindParameters.searchFields = value;
        }
    }

    ///<summary>查找关键字</summary>
    this.searchText = function (value) {
        if (arguments.length == 0) {
            return targetFindParameters.searchText;
        }
        else {
            targetFindParameters.searchText = value;
        }
    }

}