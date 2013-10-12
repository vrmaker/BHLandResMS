/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-11
 * Time: 下午5:33
 * 查询结果表格界面.
 */
Ext.Loader.setConfig({
    enable:true,
    paths:{
        'Ext.ux':'lib/extsrc/ux'
    }
});
Ext.require([
    'Ext.ux.PreviewPlugin'
]);

Ext.define('queryResult',{
    extend:'Ext.data.Model',
    fields:[
        'name',
        {name:'start',type:'date'},
        {name:'number',type:'string'},
        {name:'totalArea',type:'float'}
    ]
})

var queryGridData = [
    ['滨海新区大港2011年第21批土地征收','2/1/2013', '津国土房资准函字[2012]1301号',1.2808],
    ['滨海新区大港2011年第22批土地征收','9/3/2013', '津国土房资准函字[2012]1302号',1.2808],
    ['滨海新区大港2011年第23批土地征收','5/1/2013', '津国土房资准函字[2012]1303号',1.2808],
    ['滨海新区大港2011年第24批土地征收','6/7/2013', '津国土房资准函字[2012]1304号',1.2808],
    ['滨海新区大港2011年第25批土地征收','8/21/2013', '津国土房资准函字[2012]1305号',1.2808],
    ['滨海新区大港2011年第26批土地征收','9/1/2013', '津国土房资准函字[2012]1306号',1.2808],
    ['滨海新区大港2011年第27批土地征收','2/11/2013', '津国土房资准函字[2012]1307号',1.2808],
    ['滨海新区大港2011年第28批土地征收','3/9/2013', '津国土房资准函字[2012]1308号',1.2808]
]
var queryStore = Ext.create('Ext.data.Store',{
    autoDestroy:true,
    model:'queryResult',
    data:queryGridData
})

var pluginExpanded = true;
var QueryResGrid = {
    xtype:'gridpanel',
    id:'queryGridPage',
    anchor:'100% 100%',
    store:queryStore,
    title:'查询结果',
    selType:'checkboxmodel',
    columnLines:true,
    //frame:true,
    viewConfig: {
        id: 'gv',
        trackOver: false,
        stripeRows: false,
        plugins: [{
            ptype: 'preview',
            bodyField: 'excerpt',
            expanded: true,
            pluginId: 'preview'
        }]
    },
    tbar:[
        {
            text:'删除',
            iconCls:'record-del',
            handler:function(){
                Ext.Msg.alert("","删除");
            }
        },
        '->',
        {
            text:'返回',
            iconCls:'record-ret',
            handler:function(){
                //changeComponent("east-panel",QueryDataForm);
            }
        }
    ],
    columns:[
        { header:'批次名称',width:'25%',dataIndex:'name'},
        { header:'批准日期',width:90,dataIndex:'start',renderer: Ext.util.Format.dateRenderer('Y/m/d')},
        { header:'批准文号',width:'25%',dataIndex:'number'},
        { header:'总面积', width:80,dataIndex:'totalArea'}
    ],
    bbar: Ext.create('Ext.PagingToolbar', {
        store: queryStore,
        displayInfo: true,
        displayMsg: '显示记录{0} - {1} of {2}',
        emptyMsg: "无记录"
//        items:[
//            '-', {
//                text: 'Show Preview',
//                pressed: pluginExpanded,
//                enableToggle: true,
//                toggleHandler: function(btn, pressed) {
//                    var preview = Ext.getCmp('gv').getPlugin('preview');
//                    preview.toggleExpanded(pressed);
//                }
//            }]
    })
}