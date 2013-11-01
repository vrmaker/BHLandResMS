
var ComboData = [
    {name : '土地征转数据',   value: 'BHGIS.zy_tdzz'},   //value:服务名称
    {name : '土地开发整理',  value: 'kfzl'},
    {name : '占补平衡', value: 'zbph'},
    {name : '地热地矿',  value: 'drdk'},
    {name : '高标准基本农田', value: 'jbnt'}
]

var CheckData = {
    zzsj:[
        {name: 'OBJECTID', boxLabel: '序号',        index:'OBJECTID', type:'double' ,xType:'textfield', checked: true},
        {name: 'BSM',  boxLabel: '标识码',          index:'BSM',type:'' , xtype:''},
        {name: 'YSDM', boxLabel: '要素代码',        index:'YSDM',type:'', xtype:''},
        {name: 'TBYBH', boxLabel: '总面积',         index:'',type:'' ,  xtype:''},
        {name: 'TBBH',boxLabel: '图斑编号',        index:'',type:'' ,  xtype:''},
        {name: 'TBMJ', boxLabel: '图斑面积',        index:'TBMJ',type:'double',  xType:'numberfield'},
        {name: 'XZFQ',boxLabel: '行政分区',        index:'XZFQ',type:'string' ,  xType:'textfield'},
        {name: 'DLBM',boxLabel: '农用地转用面积',   index:'',type:'' ,  xtype:''},
        {name: 'DLMC', boxLabel: '耕地转用面积',    index:'',type:'' ,  xtype:''},
        {name: 'QSXZ', boxLabel: '未利用地转用面积',  index:'', type:'' ,  xtype:''},
        {name: 'QSDWDM', boxLabel: '补充耕地验收文号',   index:'', type:'' ,  xtype:''},
        {name: 'QSDWMC',  boxLabel: '应缴新增费面积',    index:'',type:'' ,  xtype:''},
        {name: 'ZLDWDM',  boxLabel: '征收土地面积',      index:'',type:'',  xtype:''},
        {name: 'ZLDWMC',  boxLabel: '征收农用地面积',    index:'',type:'' ,  xtype:''}
    ],
    kfzl:[
        { boxLabel: '未利用地转用面积', name: 'rb', inputValue: '8', checked: true },
        { boxLabel: '补充耕地验收文号', name: 'rb', inputValue: '9' },
        { boxLabel: '应缴新增费面积', name: 'rb', inputValue: '10' },
        { boxLabel: '征收土地面积', name: 'rb', inputValue: '11' },
        { boxLabel: '征收农用地面积', name: 'rb', inputValue: '12' }
    ],
    zbph:[
        { boxLabel: '批次名称', name: 'rb', inputValue: '1' },
        { boxLabel: '批准日期', name: 'rb', inputValue: '2', checked: true },
        { boxLabel: '批准文号', name: 'rb', inputValue: '3' },
        { boxLabel: '总面积', name: 'rb', inputValue: '4' },
        { boxLabel: '新增建设用地面积', name: 'rb', inputValue: '5' },
        { boxLabel: '农用地转用面积', name: 'rb', inputValue: '6' }
    ],
    drdk:[
        { boxLabel: '总面积', name: 'rb', inputValue: '4' },
        { boxLabel: '新增建设用地面积', name: 'rb', inputValue: '5' },
        { boxLabel: '农用地转用面积', name: 'rb', inputValue: '6' }
    ],
    jbnt:[
        { boxLabel: '批次名称', name: 'rb', inputValue: '1' },
        { boxLabel: '农用地转用面积', name: 'rb', inputValue: '6' }
    ]
}
