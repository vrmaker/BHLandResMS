/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 13-10-16
 * Time: 下午1:36
 * 标注点、线、面.
 */
var AnnotationWnd = {};
var gAnnoWnd = null;


AnnotationWnd.create = function(btnId,renderTo){
    gAnnoWnd = Ext.create('Ext.window.Window',{
        title:'地图标注',
        width:200,
        height:100,
        x:Ext.getDom("mapDiv").clientWidth/2-100,
        y:'10px',
        plain:true,
        hidden:true,
        animateTarget:btnId,
        constrain:false,

        layout:{type:'hbox',align:'middle',defaultMargins:{left:10}},
        items:[
            {
                xtype:'button',
                text:'标点',
                handler:function(){
                    annotationTools.activeAnnotationPoint()
                }
            },
            {
                xtype:'button',
                text:'标线',
                handler:function(){
                    annotationTools.activeAnnotationPolyLine()
                }
            },
            {
                xtype:'button',
                text:'标面',
                handler:function(){
                    annotationTools.activeAnnotationPolygon()
                }
            }
        ],
        listeners:{
            close:function(){
                annotationTools.removeFeatureLayer();
            }  //监听关闭事件
        }
    });
    gAnnoWnd.render(renderTo);
};
AnnotationWnd.show = function(){
    gAnnoWnd.show();
}
AnnotationWnd.close = function(){
    Global.gIsClose = true;
    gAnnoWnd.close();
    gAnnoWnd = null;
}


