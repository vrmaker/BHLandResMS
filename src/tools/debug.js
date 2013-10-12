/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-12
 * Time: 下午5:16
 * 断言.
 */

//bCondition＝0，先向标准错误流打印一条出错信息，然后通过调用abort来终止程序运行
function assert(bCondition,sErrorMsg){

    if(!bCondition){
        throw new Error(sErrorMsg);
    }
}