/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-9
 * Time: 下午3:04
 * 工具条类.
 */
//var gIsClose = 1;  //判断窗口是否关闭，避免第二次点击窗口时，输入框错误

var gToolbar = {
    width:'100%',
    height:37,

    bodyStyle:{       //测试tbar用
        background: '#fcc'
    },
    tbar:[
        {
            border:false,
            margin:'0 3',
            id:'measure-len',
            text:'测距',
            iconCls:'length-measure',
            handler:function(){
//                var lenPanel = Ext.getCmp('len-panel');
//                lenPanel.el["slideIn"]("t"); //顶边中心

                if(gWnd)MeasureWnd.close();
                console.log("1111",Global.gIsClose);
                if(Global.gIsClose){    //判断窗口是否关闭，避免第二次点击窗口时，输入框显示错误
                    Global.gIsClose = false;
                    console.log("2222",Global.gIsClose);
                    MeasureWnd.create("测量距离结果","measure-len","center-panel");
                    MeasureWnd.show();

                    measureTools.activeMeasureLength();
                }

            }
        },
        {
            border:false,
            margin:'0 3',
            id:'measure-area',
            text:'测面',
            iconCls:'area-measure',
            handler:function(){
                if(gWnd)MeasureWnd.close();
                console.log("3333",Global.gIsClose);
                if(Global.gIsClose){    //判断窗口是否关闭，避免第二次点击窗口时，输入框显示错误
                    Global.gIsClose = false;
                    console.log("4444",Global.gIsClose);
                    MeasureWnd.create("测量面积结果","measure-area","mapDiv");
                    MeasureWnd.show();

                    measureTools.activeMeasureArea();
                }
            }

        },
        {
            border:false,
            margin:'0 3',
            text:'识别',
            iconCls:'map-identify',
            handler:function(){
                identifyTaskHelper.activeIdentifyEvent();
            }
        },
        {
            border:false,
            margin:'0 3',
            id:'map-annotation',
            text:'标注',
            iconCls:'map-sign',
            handler:function(){
                if(gAnnoWnd)AnnotationWnd.close();
                if(Global.gIsClose){    //判断窗口是否关闭，避免第二次点击窗口时，输入框显示错误
                    Global.gIsClose = false;
                    AnnotationWnd.create("map-annotation","mapDiv");
                    AnnotationWnd.show();

                    annotationTools.initAnnotationTools();
                }
            }
        },
        {
            border:false,
            margin:'0 3',
            text:'查询',
            iconCls:'map-query',
            handler:function(){
                switchPage("east-panel","queryFormPage");
            }
        },
        {
            border:false,
            margin:'0 3',
            text:'统计',
            iconCls:'map-statstic',
            handler:function(){
                switchPage("east-panel","statFormPage");
            }
        },
        {
            border:false,
            text:'图层',
            iconCls:'map-ctrl',
            handler:function(){
                var toc = Ext.getCmp('west-panel');
                toc.collapsed ? toc.expand(): toc.collapse();
            }
        }
    ]
}

var changeComponent = function(parentId,component)
{
    var panel = Ext.getCmp(parentId);
    //先移除原有组件
    if(panel)
    {
        for(var i=0 ;i<panel.items.keys.length;i++){
            panel.remove(panel.items.keys[i]);
        }
        panel.add(component);
    }
    gCurrEastComponent = component;
}

/*
* parentId:layout="card"的窗口窗口
* toId:切换至新的窗口ID
* fromId:被切换窗口ID
* filePath:如果文件未被加载，写入js文件路径
* */
var switchPage = function(parentId,toId,fromId,filePath)  //fromId可为空
{
    var cmp = Ext.getCmp(parentId);
    var contentPage = Ext.getCmp(toId);
    var filePath = filePath || null;
    var fromId = fromId || null;
    if(contentPage){
        cmp.getLayout().setActiveItem(contentPage);
        gPrevComponentId = fromId;
    }
    else{
        contentPage.getLoader().load({
            url:filePath,
            renderer:"component"
        });
        //assert(contentPage,"no exist page");
    }
}