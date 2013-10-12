/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-9
 * Time: 下午3:04
 * 工具条类.
 */

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
            text:'测距',
            iconCls:'length-measure'
        },
        {
            border:false,
            margin:'0 3',
            text:'测面',
            iconCls:'area-measure'
        },
        {
            border:false,
            margin:'0 3',
            text:'识别',
            iconCls:'map-identify'
        },
        {
            border:false,
            margin:'0 3',
            text:'标注',
            iconCls:'map-sign'
        },
        {
            border:false,
            margin:'0 3',
            text:'查询',
            iconCls:'map-query',
            handler:function(){
                switchPage("east-panel","src/view/queryForm.js","queryFormPage");
            }
        },
        {
            border:false,
            margin:'0 3',
            text:'统计',
            iconCls:'map-statstic',
            handler:function(){
                switchPage("east-panel","src/view/statForm.js","statFormPage");
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

var switchPage = function(parentId,filePath,toId,fromId)  //fromId可为空
{
    var cmp = Ext.getCmp(parentId);
    var contentPage = Ext.getCmp(toId);
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