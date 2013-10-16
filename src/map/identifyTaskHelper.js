/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: cl
 * Date: 13-4-24
 * Time: 上午10:59
 * 文件功能描述：属性识别功能模块执行程序.
 */
dojo.require("esri.tasks.identify");

///<param name="url" type="String">需要识别的地图服务url</param>
///<param name="options" type="Object">参数，可不填
///<childParam key="gdbVersion" type="String">指定geodatabase版本</childParam>
///</param>
function IdentifyTaskHelper(url, options) {
    var targetIdentifyTask;
    if (arguments.length == 1) {
        targetIdentifyTask = new esri.tasks.IdentifyTask(url);
    }
    else {
        targetIdentifyTask = new esri.tasks.IdentifyTask(url, options);
    }

    ///<summary>identifyTask</summary>
    ///<returns>IdentifyTask</returns>
    this.identifyTask = targetIdentifyTask;

    ///<summary>执行识别查询</summary>
    ///<param name="idPa" type="IdentifyParameters">IdentifyParameters识别查询参数</param>
    ///<param name="callBack" type="function">查询成功返回函数</param>
    ///<param name="errBack" type="function">查询出错返回函数</param>
    ///<returns>layer</returns>
    this.execute = function (idPa,callBack,errBack) {
        targetIdentifyTask.execute(idPa, callBack, errBack);
    }

}