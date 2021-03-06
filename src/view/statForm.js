/**
 * Created with JetBrains WebStorm.
 * User: cl
 * Date: 13-10-11
 * Time: 上午9:37
 * 统计模块表单设计.
 */

var StatDataForm = {
    xtype:'panel',
    id:'statFormPage',
    border:false,

    items:[
        //1.选择统计专题数据
        {
            xtype:'displayfield',
            width:'90%',
            height:25,
            margin:'10',
            fieldStyle:{
                background: '#e5eeff'
            },

            value:'选择统计专题数据：'
        },
        {
            width:      240,
            height:     25,
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
                data   : ComboData
            }),
            listeners:{
                change:function(newValue){
                    for(var v in CheckData){
                        if(newValue.getValue() == v){
                            Ext.getCmp('multiField-cbgroup-stat').removeAll();
                            gValue = CheckData[v];
                            Ext.getCmp('multiField-cbgroup-stat').add(gValue);
                            console.log(Ext.getCmp('multiField-cbgroup'));
                        }
                    }
                }
            }
        },
        //2.选择查询区域
        {
            xtype:'displayfield',
            width:'90%',
            height:25,
            margin:'10',
            fieldStyle:{
                background: '#e5eeff'
            },
            labelPad:10,
            value:'选择统计区域：'
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
                    text:'统计'
                }
            ]
        },
        //3.输入查询关键字
        {
            xtype:'displayfield',
            width:'90%',
            height:25,
            margin:'10',
            fieldStyle:{
                background: '#e5eeff'
            },
            labelPad:10,
            value:'输入统计关键字：'
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
                    text:'统计',
                    handler:function(){
                        switchPage("east-panel","queryGridPage","statFormPage");
                    }
                }
            ]
        },
        //5.输出字段checkbox
        {
            xtype:'checkboxgroup',
            id:'multiField-cbgroup-stat',
            layout:'vbox',
            autoScroll:true,
            margin:'10',
            items:  CheckData.zzsj
        }
    ]
}