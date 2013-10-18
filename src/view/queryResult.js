/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-11
 * Time: 下午5:33
 * 查询结果表格界面.
 */


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
]
var queryStore = Ext.create('Ext.data.Store',{
    autoDestroy:true,
    autoLoad:false,
    model:'queryResult',
    pageSize: 10,
    proxy: {
        // load using script tags for cross domain, if the data in on the same domain as
        // this page, an HttpProxy would be better
        type: 'ajax',
        url: 'src/data/pagingstore.js',
        reader: {
            root: 'resluts',
            totalProperty: 'totalCount'
        },
        // sends single sort as multi parameter
        simpleSortMode: true
    }
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
                switchPage("east-panel",gPrevComponentId);
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
    })

}
//queryStore.loadPage(0);
queryStore.load({
    params:{
        start:0,
        limit: 10
    }
});