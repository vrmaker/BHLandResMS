/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-9
 * Time: 下午2:41
 * 数据图层的树控件类.
 */

var store1 = Ext.create('Ext.data.TreeStore', {
    root: {
        text:"数据资源",
        checked:false,
        expanded: true,
        children: [
            { text: "基础地理数据", checked:true,expanded:true,children:[
                { text: "基础地形图",checked:true, leaf: true },
                { text: "影像数据", checked:true,leaf: true}
            ]},
            { text: "业务审批数据", checked:true,expanded: true, children: [
                { text: "选址意见书",checked:true, leaf: true },
                { text: "规划条件", checked:true,leaf: true}
            ] },
            { text: "资源处专题数据", checked:true,leaf: true }
        ]
    }
});

Ext.define('KitchenSink.view.tree.BasicTrees', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.tree.*',
        'Ext.data.*'
    ],
    alias:'myBasicTree',
    xtype: 'treepanel',
    width: 300,
    height: 200,
    rootVisible: true,
    store:store1,
    test:2,

    // Sharing the store synchronizes the views:

    initComponent: function() {

        this.callParent();
    }
});

var createTree = function(){

    Ext.require("KitchenSink.view.tree.BasicTrees");
    var tree = Ext.create("myBasicTree",{
        width:250,
        height:1000,
        rootVisible:true,
        renderTo:'treeDiv'

    });
    console.log("store1",tree.store);

    tree.on("expand",function(ePots){
        alert("");
    })
    tree.on("itemclick",function(ePots){
        console.log(ePots);
    })
}
