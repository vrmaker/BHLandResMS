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
        {name:'OBJECTID'},
        {name:'TBMJ'},
        {name:'XZFQ'}
    ]
})

var currLayer = null;
var queryStore = null;
var pluginExpanded = true;
var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
    clicksToMoveEditor: 1,
    autoCancel: false
});

var QueryResGrid = Ext.create('Ext.grid.Panel',{
    //xtype:'gridpanel',
    id:'queryGridPage',
    autoDestroy:true,
    anchor:'100% 100%',
    store:queryStore,
    title:'查询结果',
    selType:'checkboxmodel',
    columnLines:true,
    plugins:[rowEditing],
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
                var sm = QueryResGrid.getSelectionModel();
                console.log(sm.getSelection());

                var deleteStr = "";
                var select = sm.getSelection();
                for(var i=0;i<select.length;i++){
                     deleteStr += "OBJECTID" + "%3D" + select[i].data.OBJECTID + " or ";
                }
                deleteStr = deleteStr.slice(0,deleteStr.length-4);
                Ext.Ajax.request({
                    url:'../BHLandResSite/Delete.ashx?'+ "delObject="+deleteStr +'&delLayer='+currLayer,
                    success: function(response){
                        var text = response.responseText;
                        // process server response here
                    }
                })
                queryStore.remove(sm.getSelection());
            }
        },
        '->',
        {
            text:'返回',
            iconCls:'record-ret',
            handler:function(){
                findTaskHandler.clearAll();  //清空图层graphic
                switchPage("east-panel",gPrevComponentId);
            }
        }
    ],
    columns:[
//        { header:'OBJECTID',width:'20px',dataIndex:'OBJECTID'},
////        { header:'批准日期',width:90,dataIndex:'start',renderer: Ext.util.Format.dateRenderer('Y/m/d')},
//        { header:'TBMJ',width:'25%',dataIndex:'TBMJ'},
//        { header:'XZFQ',width:'25%',dataIndex:'XZFQ'}
    ],
    bbar:Ext.create('Ext.PagingToolbar', {
        id:'pagingbar',
        store: queryStore,
        dock : 'bottom',
        displayInfo: true,
        displayMsg: '显示记录{0} - {1} of {2}',
        emptyMsg: "无记录"
    }),

    listeners:{
        cellcontextmenu:function(com,td, cellIndex, record, tr, rowIndex, e, eOpts){

            var record = this.getStore().getAt(rowIndex);
            var objID = record.data.OBJECTID;

            findTaskHandler.findHandler(mymap,currLayer);
            findTaskHandler.doFind(objID);
            console.log("click", record);
        },
        edit:function(editor,e){         //update提交
            console.log("editor",editor);
            console.log("record",e.record);
            console.log("e", e.record.modified);

            var updateStr = "";

            for(var k in e.record.modified){   //只发送被更改的数据。注：该数据为更改前老数据
                if(k == "OBJECTID")continue;  //去除第一个值OBJECTID;"
                updateStr += k + "%3D" + e.newValues[k] + ",";
            }
            updateStr = updateStr.slice(0,updateStr.length-1);

            Ext.MessageBox.show({
                title: '',
                msg: '是否确定要修改数据？',
                buttons: Ext.MessageBox.YESNO,
                buttonText:{
                    yes: "是",
                    no: "否"
                },
                fn: function(btn){
                    console.log("param",btn);
                    if(btn == "yes"){
                        Ext.Ajax.request({
                            url:'../BHLandResSite/Update.ashx?'+ "uField="+updateStr +'&uLayer='+currLayer +'&uObject='+e.record.modified.OBJECTID,
                            success: function(response){
                                var text = response.responseText;
                                //Ext.tipMsg.msg('记录已经修改完毕');
                            }
                        })
                    }
                    else if(btn == "no"){
                        //editor.cancelEdit();

                        for(var j in e.record.modified){
                                e.record.data[j] = e.record.modified[j];
                        }

                        QueryResGrid.store.reload();
                        //e.record.set("data", e.record.modified);
                    }

                }
            })


        }
    }
});


var submitData = function(layer,arrRegion,arrHeader){
    var colModelArray = [];
    var lableStr = "";
    var regionStr = "";
    currLayer = layer;
    //行政地区
    for(var i=0;i<arrRegion.length-1;i++){
        regionStr += arrRegion[i].inputValue +",";   //在后台拼接region="大港",region="塘沽"
    }
    regionStr += arrRegion[arrRegion.length-1].inputValue;
    //统计字段
    for(var i=0;i<arrHeader.length;i++){
        colModelArray[i] = {header:arrHeader[i].boxLabel,dataIndex:arrHeader[i].index,editor:{xtype:arrHeader[i].xType,allowBlank:true}}
        if(i<arrHeader.length-1)
            lableStr += arrHeader[i].name +",";  //
    }
    //colModelArray[0].hidden = true;  //隐藏OBJECTID列
    lableStr += arrHeader[arrHeader.length-1].name;

     queryStore = Ext.create('Ext.data.Store',{
        autoDestroy:true,
        autoLoad:false,
        model:'queryResult',
        pageSize: 15,
        proxy: {
            type: 'ajax',
            //url: 'src/data/testpaging.js',
            url: '../BHLandResSite/Query.ashx?qLayer='+currLayer+'&qField='+lableStr+'&qRegion='+regionStr,
            reader: {
                root: 'results',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        }
    })

    Ext.getCmp("pagingbar").bindStore(queryStore);
    //QueryResGrid.addDocked(pageingBar,0);

    queryStore.load({
            params:{
                start:0
                //limit: 2,
            },
            callback:function(records, operation, success){
                console.log("resp",records);
                console.log("operation",operation);
                console.log("success",success);
            }
        }
    );
    colModelArray.unshift({xtype: 'rownumberer'});
    QueryResGrid.reconfigure(queryStore,colModelArray);

//    var col = QueryResGrid.columns;  //隐藏ObjectId列
//    col[0].hide();
}
