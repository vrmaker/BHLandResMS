/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-8
 * Time: 下午1:51
 * 页面的整体布局.
 */
Ext.Loader.setConfig({
    enable:true,
    paths:{
        'Ext.ux':'lib/ux'
    }
});
Ext.require([
    'Ext.ux.PreviewPlugin'
]);


Ext.onReady(function(){
    Ext.QuickTips.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    //屏蔽浏览器默认右键弹出菜单
    Ext.getDoc().on("contextmenu", function(e){
        e.stopEvent();
    });

    var viewport = Ext.create('Ext.Viewport',{

        id : "viewport-border",
        layout:'border',
        border:false,
        //TODO 1:创建布局(上、左、右、中)
        items: [
            {
                xtype:'panel',
                height:100,
                frame:false,
                region:'north',
                layout:'vbox',
                items:[
                    //第一行
                    {
                        width:'100%',
                        height:61,
                        layout:{
                            type:'hbox',
                            align:'middle',
                            //minWidth:500,
                            defaultMargins:{left: 10}
                        },

                        bodyStyle:{
                            background: '#ffc'
                        },
                        items:[
                            //1.logo图标
                            {
                                xtype:'component',
                                width:136,
                                height:36,
                                margin:'0 0 0 10',   //加上默认marginLeft
                                autoEl:{
                                    tag:'img',
                                    src:'resources/landres/img/logo.png'
                                }
                            },
                            //2.道路查询输入框
                            {
                                xtype:'textfield',
                                hideLabel:true,
                                width:300,  //调整文本框宽度
                                height:30,
                                allowBlank:false,  //是否允许为空
                                msgTarget:'side'
                            },
                            //道路查询按钮
                            {
                                xtype:'button',
                                text:'道路查询',
                                width:98,
                                height:30,
                                handler:function(){
                                    Ext.Msg.alert("haha");
                                }
                            },
                            {
                                //占位
                                border:false,
                                flex:6
                            },
                            {
                                xtype:'button',
                                text:'注销',
                                border:false,
                                margin:'0 30 0 0',
                                handler:function(){
                                    Ext.Msg.alert("","退出");
                                }

                            }
                        ]
                    },
                    //toolbar对象
                    gToolbar
                ]
            },
            {
                region: 'west',
                id:'west-panel',
                contentEl: 'treeDiv',
                split: true,
                width: 250,
                minSize: 100,
                maxSize: 200,
                draggable:true,
                collapsible: true,
                collapsed: false,
                //floating:'toFront',
                title: '数据资源'
            },
            {
                xtype:'panel',
                region:'center',
                id:'center-panel',
                //deferredRender: false,
               // baseCls: 'my-panel-no-border:true',
                items:[
                    {
                        contentEl:'mapDiv'
                    }
                ]
            },
            {
                xtype:'panel',
                id:'east-panel',
                region:'east',
                layout:'card',
                collapsible: true,
                collapsed: false,
                width:300,
                height:600,
                minWidth:270,
                split:true,
                items:[
                    //card页
                    QueryDataForm,
                    StatDataForm,
                    QueryResGrid,
                    PropertyGrid
                ]
            }
        ]

    })
    //TODO 2:创建树
    createTree();

})

//TODO 3: 创建地图
dojo.addOnLoad(initMap);
