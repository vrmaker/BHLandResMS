/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-9
 * Time: 下午2:41
 * 数据图层的树控件类.
 */

var createTree = function(){
    Ext.create("Ext.data.TreeStore",{
        id:'treeStore',
        proxy: {
            type: 'ajax',
            url : 'config/TreeData.js'
        },
        root:{
            text:'数据资源',
            expanded:true,
            checked:true
        }
    });

    var tree = Ext.create("Ext.tree.Panel",{
        width:Ext.getCmp('west-panel').getWidth(),
        height:Ext.getCmp('west-panel').getHeight()-40,
        store:"treeStore",
        rootVisible:true,
        renderTo:'treeDiv',
        viewConfig:{
            listeners:{
                refresh:function(){
                    this.select(0);
                },
                checkchange:function(node,checked){
                    if(node.isLeaf()){
                        gMapHelper.setTitleMapVisible(node.raw.leafValue);  //设置切片或动态的可见性
                        gMapHelper.setDymaticMapVisible(node.raw.leafValue);  //叶子结点
                    }

                    if(node.childNodes.length>0)
                        this.setChildNode(node.childNodes,checked)

                    if(node.parentNode !=null  ){
                        this.setParentNode(node.parentNode,checked);

                    }
                }
            },
            setParentNode:function(node,checked){

                var checkedCount = 0;
                for(var i=node.childNodes.length-1;i>=0;i--){
                    if(node.childNodes[i].data.checked == true){checkedCount++;break;}
                }
                if(checkedCount == 0 && checked ==false)node.set("checked",checked);  //逐级删除父结点勾选
                if(checkedCount == 1 && checked ==true)node.set("checked",checked);   //逐级添加父结点勾选

                if(node.parentNode !=null){
                    this.setParentNode(node.parentNode,checked);
                }
            },
            setChildNode:function(node,checked){
                if(Ext.isArray(node)){
                    for(var i=node.length-1;i>=0;i--){
                        this.setChildNode(node[i],checked);
                    }
                }else{
                    if(node.data.checked!=null){

                        if(node.data.checked == checked){
                            //如果叶结点的已经checked=false,则父结点忽略修改该结点
                        }
                        else{
                            node.set("checked",checked);
                            //console.log("node",node);
                            gMapHelper.setTitleMapVisible(node.raw.leafValue);  //设置切片或动态的可见性
                            gMapHelper.setDymaticMapVisible(node.raw.leafValue);

                        }

                    }
                    if(node.childNodes.length>0)
                        this.setChildNode(node.childNodes,checked);
                }
            }

        }
    })

}
