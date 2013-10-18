/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-16
 * Time: 下午5:35
 * 属性表.
 */

//必须使用create创建
var PropertyGrid = Ext.create('Ext.grid.property.Grid', {
    title: 'Properties Grid',
    id:'property-grid',
    width: 300,
    disable:true
});

//取消可编辑功能
PropertyGrid.on("beforeedit", function(e){
    e.cancel = true;
    return false;
});
