/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-9
 * Time: 下午9:13
 * 用于查询、统计的表单类.
 */
var QueryDataForm = {
        xtype:'form',
        id:'queryFormPage',
        layout:{
            type:'anchor',
            anchor:'90%'
        },
        border:false,

    items:[
    //1.选择专题数据
    {
        xtype:'displayfield',
        anchor: '95%',
        height:25,
        margin:'10',
        fieldStyle:{
            background: '#e5eeff'
        },
        labelPad:10,
        value:'选择查询专题数据：'
    },
    {
        width:      240,
        height:     25,
        anchor:    '90%',
        margin:     '15,10,15,10',
        xtype:          'combo',
        queryMode:      'local',
        value:          'zzsj',
        triggerAction:  'all',
        forceSelection: true,
        editable:       false,
        hideLabel:      true,
        name:           'title',
        displayField:   'name',
        valueField:     'value',
        store:          Ext.create('Ext.data.Store', {
            fields : ['name', 'value'],
            data   : [
                {name : '土地征转数据',   value: 'zzsj'},
                {name : '土地开发整理',  value: 'kfzl'},
                {name : '占补平衡', value: 'zbph'},
                {name : '地热地矿',  value: 'drdk'},
                {name : '高标准基本农田', value: 'jbnt'}
            ]
        })
    },
    //2.选择查询区域
    {
        xtype:'displayfield',
        anchor: '95%',
        height:25,
        margin:'10',
        fieldStyle:{
            background: '#e5eeff'
        },
        labelPad:10,
        value:'选择查询区域：'
    },
    {
        defaultType:'checkbox',
        layout:'hbox',
        border:false,
        margin:' 20 20 20 20',
        items:[
            {
                boxLabel: '塘沽',
                name: 'name-tanggu',
                inputValue: 'v-tanggu',
                margin:'0 10 0 0'
            }, {
                boxLabel: '汉沽',
                name: 'name-hangu',
                inputValue: 'v-hangu',
                margin:'0 10'
            }, {
                checked: true,
                boxLabel: '大港',
                name: 'name-dagang',
                inputValue: 'v-dagang',
                margin:'0 20 0 0'
            },
            {
                xtype:'button',
                text:'查询'
            }
        ]
    },
    //3.输入查询关键字
    {
        xtype:'displayfield',
        anchor: '95%',
        height:25,
        margin:'10',
        fieldStyle:{
            background: '#e5eeff'
        },
        labelPad:10,
        value:'输入查询关键字：'
    },
    {
        xtype:'textfield',
        width:'90%',
        height:30,
        margin:'10 10 10 10',
        hideLabel:true

    },
    //4.选择输出字段
    {
        layout:'hbox',
        border:false,
        items:[
            {
                xtype:'displayfield',
                height:25,
                margin:'10',
                labelPad:10,
                value:'选择输出字段（多选）：'
            },
            {
                xtype:'button',
                margin:'10 10 10 40',
                text:'查询',
                handler:function(){
                    changeComponent("east-panel",QueryResGrid);
                }
            }
        ]
    },
    //5.输出字段checkbox
    {
        xtype:'checkboxgroup',
        layout:'vbox',
        margin:'10',
        items: [
            { boxLabel: '批次名称', name: 'rb', inputValue: '1' },
            { boxLabel: '批准日期', name: 'rb', inputValue: '2', checked: true },
            { boxLabel: '批准文号', name: 'rb', inputValue: '3' },
            { boxLabel: '总面积', name: 'rb', inputValue: '4' },
            { boxLabel: '新增建设用地面积', name: 'rb', inputValue: '5' },
            { boxLabel: '农用地转用面积', name: 'rb', inputValue: '6' },
            { boxLabel: '耕地转用面积', name: 'rb', inputValue: '7' },
            { boxLabel: '未利用地转用面积', name: 'rb', inputValue: '8', checked: true },
            { boxLabel: '补充耕地验收文号', name: 'rb', inputValue: '9' },
            { boxLabel: '应缴新增费面积', name: 'rb', inputValue: '10' },
            { boxLabel: '征收土地面积', name: 'rb', inputValue: '11' },
            { boxLabel: '征收农用地面积', name: 'rb', inputValue: '12' }
        ]
    }
]
}