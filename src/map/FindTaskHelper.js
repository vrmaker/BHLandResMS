/**
 * Created with JetBrains WebStorm.
 * Copyright(C)  天津市滨海新区规划和国土资源地理信息中心
 * User: Admin
 * Date: 13-4-24
 * Time: 下午4:11
 * 文件功能描述：地名点定位执行程序.
 */

dojo.require("esri.tasks.find");

///<summary>查找查询辅助帮手</summary>
///<param name="url" type="String">需要查找的地图服务url</param>
///<param name="options" type="Object">参数，可不填
///<childParam key="gdbVersion" type="String">指定geodatabase版本</childParam>
///</param>
///<returns>没有返回值</returns>
function DistFindTaskHelper(url, options) {
    var targetFindTask;
    if (arguments.length == 1) {
        targetFindTask = new esri.tasks.FindTask(url);
    }
    else {
        targetFindTask = new esri.tasks.FindTask(url, options);
    }

    ///<summary>findTask</summary>
    ///<returns>FindTask</returns>
    this.findTask = targetFindTask;

    ///<summary>执行识别查询</summary>
    ///<param name="idPa" type="FindParameters识别查询参数">FindParameters查找查询参数</param>
    ///<param name="callBack" type="function">查询成功返回函数</param>
    ///<param name="errBack" type="function">查询出错返回函数</param>
    ///<returns>layer</returns>
    this.execute = function (idPa, callBack, errBack) {
        targetFindTask.execute(idPa, callBack, errBack);
    }

}