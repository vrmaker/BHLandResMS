/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-8
 * Time: 下午1:51
 * 页面的整体布局.
 */
Ext.onReady(function(){
    Ext.QuickTips.init();

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var viewport = Ext.create('Ext.Viewport',{

        id : "viewport-border",
        layout:'border',
        items: [
            {
                height:60,
                region:'north',
                layout:'hbox',
                items:[
                    //1.logo图标
                    {
                        xtype:'component',
                        width:136,
                        height:36,
                        style:{
                            marginTop:'10px'
                        },
                        autoEl:{
                            tag:'img',
                            src:'resources/landres/logo.png'
                        }
                    },
                    //2.道路查询输入框
                    {
                        xtype:'textfield',
                        hideLabel:true,
                        width:300,  //调整文本框宽度
                        height:30,
                        allowBlank:false,  //是否允许为空
                        msgTarget:'side',
                        style:{
                            marginLeft:'20px',
                            marginTop:'15px'
                        }
                    },
                    //道路查询按钮
                    {
                        xtype:'button',
                        text:'道路查询',
                        width:98,
                        height:30,
                        handler:function(){
                            Ext.Msg.alert("haha");
                        },
                        style:{
                            marginLeft:'20px',
                            marginTop:'15px'
                        }
                    }
                ]
            },
            {
                region: 'west',
                contentEl: 'west',
                split: true,
                width: 300,
                minSize: 100,
                maxSize: 200,
                collapsible: true,
                collapsed: true,
                title: 'West',
                margins: '0 0 0 0'
            },
            {
                xtype:'component',
                region:'center',
                //deferredRender: false,
                items:[
                    {
                        contentEl:'myMap'
                    }
                ]
            }
        ]

    })
})