/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 13-10-16
 * Time: 下午1:36
 * To change this template use File | Settings | File Templates.
 */
var MeasureWnd = {};
var gWnd = null;


MeasureWnd.create = function(tittle,btnId,renderTo){
    gWnd = Ext.create('Ext.window.Window',{
        title:tittle,
        width:300,
        height:100,
        x:Ext.getDom("mapDiv").clientWidth/2-175,
        y:'10px',
        plain:true,
        hidden:true,
        animateTarget:btnId,
        constrain:false,

        layout:{type:'hbox',align:'middle',defaultMargins:{left:10}},
        items:[
            {
                xtype:'textfield',
                id:'result-field',
                hideLabel:true,
                width:'100'
            },
            {
                xtype:'button',
                text:'回退',
                handler:function(){
                    measureTools.rollback();
                }
            },
            {
                xtype:'button',
                text:'清除',
                handler:function(){
                    measureTools.clearAll();
                }
            }
        ],
        listeners:{
            close:function(){measureTools.clearAll();}  //监听关闭事件
        }


    });
    gWnd.render(renderTo);
};
MeasureWnd.show = function(){
    gWnd.show();
}
MeasureWnd.close = function(){
    Global.gIsClose = true;
    gWnd.close();
    gWnd = null;

}


