/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-17
 * Time: 上午11:43
 * 标注属性信息.
 */
var AnnotationMsgWnd = {};
var gAnnoMsgWnd = null;

AnnotationMsgWnd.create = function(){
    gAnnoMsgWnd = Ext.create('Ext.window.Window',{
        title:'添加标注信息',
        width:300,
        height:200,
        hidden:true,
        constrain:false,
        modal:true,
        defaults:{labelWidth:30},
        layout:{type:'vbox',align:'middle',defaultMargins:{left:10}},
        items:[
            {
                xtype:'textfield',
                id:'name-field',
                width:'95%',
                fieldLabel:'名称',
                margin:'10 0 0 0'
            },
            {
                xtype:'textarea',
                id:'remark-field',
                width:'95%',
                fieldLabel:'备注',
                margin:'5 0 0 0'

            },
            {
                width:'100%',
                border:false,
                layout:{type:'hbox',pack:'end',defaultMargins:{right:10}},
                margin:'10 0 0 0',
                items:[
                    {
                        xtype:'button',
                        text:'保存',
                        pack:'end',
                        handler:function(){
                            annotationTools.saveAttribute();
                            AnnotationMsgWnd.close();
                        }
                    },
                    {
                        xtype:'button',
                        text:'删除',
                        handler:function(){
                            annotationTools.deleteAttribute();
                            AnnotationMsgWnd.close();
                        }
                    },
                    {
                        xtype:'button',
                        text:'关闭',
                        handler:function(){
                            AnnotationMsgWnd.close();
                        }
                    }
                ]

            }
        ],
        listeners:{
            close:function(){

            }  //监听关闭事件
        }
    });
};
AnnotationMsgWnd.show = function(){
    gAnnoMsgWnd.show();
}
AnnotationMsgWnd.close = function(){
    Global.gIsClose = true;
    gAnnoMsgWnd.close();
    gAnnoMsgWnd = null;
}
