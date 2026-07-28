const fs = require('fs');

function t(id, name, content, fill, fontSize, extra) {
  return { type:'text', id, name, content, fill:fill||'#1A1A1A', fontSize:fontSize||14, fontFamily:'Roboto', ...(extra||{}) };
}

function f(id, name, children, extra) {
  return { type:'frame', id, name, children, ...(extra||{}) };
}

function r(id, name, w, h, fill, extra) {
  return { type:'rectangle', id, name, width:w, height:h, fill:fill||'#E0E0E0', ...(extra||{}) };
}

function ref(id, name, refId, extra) {
  return { type:'ref', id, name, ref:refId, ...(extra||{}) };
}

const arrFiltro = ['Nome','E-mail','CPF','Telefone','Cargo'];
const arrMainNav = [
  ['Inicio','\u2302','\u2318\u21E7H'],
  ['Dashboard','\u2B21','\u2318\u21E7D'],
  ['Admin','\u2699','\u2318\u21E7A']
];
const arrSubNav = [
  ['Usuarios','\uD83D\uDC65','\u2318\u21E7U'],
  ['RBAC','\uD83D\uDD11','\u2318\u21E7R'],
  ['Erros','\u26A0','\u2318\u21E7E'],
  ['Health','\u2665','\u2318\u21E7C']
];
const arrMobileNav = [
  ['Inicio','\u2302'],['Dashboard','\u2B21'],['Admin','\u2699'],
  ['Usuarios','\uD83D\uDC65'],['RBAC','\uD83D\uDD11'],['Erros','\u26A0'],['Health','\u2665']
];
const arrLegends = [
  ['Admin','$primary','12'],
  ['Usuarios','$success','28'],
  ['Convidados','$warning','5']
];
const arrRows = ['Joao Silva','Maria Santos','Pedro Costa'];
const arrFiltrosAplicados = ['Nome: Joao','Status: Ativo','Cargo: Admin'];
const arrRailIcons = ['\u2302','\u2B21','\u2699','\uD83D\uDC65','\uD83D\uDD11','\u26A0','\u2665'];

let doc = {
  version: '2.14',
  fileToken: 'c5ae3c77-6fab-4962-9e0a-1bb13d7b0eed',
  variables: {
    bg: {type:'color',value:[{value:'#FAFAFB',theme:{mode:'light'}},{value:'#121212',theme:{mode:'dark'}}]},
    surface: {type:'color',value:[{value:'#FFFFFF',theme:{mode:'light'}},{value:'#1E1E1E',theme:{mode:'dark'}}]},
    primary: {type:'color',value:[{value:'#1976D2',theme:{mode:'light'}},{value:'#90CAF9',theme:{mode:'dark'}}]},
    secondary: {type:'color',value:[{value:'#424242',theme:{mode:'light'}},{value:'#BDBDBD',theme:{mode:'dark'}}]},
    error: {type:'color',value:[{value:'#D32F2F',theme:{mode:'light'}},{value:'#EF9A9A',theme:{mode:'dark'}}]},
    success: {type:'color',value:[{value:'#2E7D32',theme:{mode:'light'}},{value:'#A5D6A7',theme:{mode:'dark'}}]},
    warning: {type:'color',value:[{value:'#F57C00',theme:{mode:'light'}},{value:'#FFCC80',theme:{mode:'dark'}}]},
    info: {type:'color',value:[{value:'#0288D1',theme:{mode:'light'}},{value:'#81D4FA',theme:{mode:'dark'}}]},
    'text-primary': {type:'color',value:[{value:'#1A1A1A',theme:{mode:'light'}},{value:'#F5F5F5',theme:{mode:'dark'}}]},
    'text-secondary': {type:'color',value:[{value:'#666666',theme:{mode:'light'}},{value:'#AAAAAA',theme:{mode:'dark'}}]},
    'text-disabled': {type:'color',value:[{value:'#9E9E9E',theme:{mode:'light'}},{value:'#616161',theme:{mode:'dark'}}]},
    'font-family': {type:'string',value:'Roboto'}
  },
  children: []
};

// 1. BtnPrimary
doc.children.push(f('egrTt','BtnPrimary',[
  t('kcM3q','Label','Button','#FFFFFF',14,{fontWeight:'500'})
],{reusable:true,width:90,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6}));

// 2. BtnOutline
doc.children.push(f('A55RDh','BtnOutline',[
  t('ZwuxH','Label','Button','$primary',14,{fontWeight:'500'})
],{reusable:true,width:90,height:36,fill:'transparent',padding:[8,20],gap:8,cornerRadius:6,stroke:'$primary',strokeWidth:1}));

// 3. BtnDanger
doc.children.push(f('em8r1','BtnDanger',[
  t('uk26E','Label','Button','#FFFFFF',14,{fontWeight:'500'})
],{reusable:true,width:90,height:36,fill:'$error',padding:[8,20],gap:8,cornerRadius:6}));

// 4. DrawerItem
doc.children.push(f('My99T','DrawerItem',[
  t('cTNpd','Icon','\u25CF','$text-secondary',20),
  t('DR3jI','Label','Item','$text-primary',14),
  t('H0pYvP','Hotkey','\u2318\u21E7H','$text-disabled',12)
],{reusable:true,width:240,height:44,padding:[0,12],gap:12,cornerRadius:8}));

// 5. DrawerGroup
doc.children.push(f('Kfqgj','DrawerGroup',[
  f('Ew16k','GroupHeader',[
    t('cUrQd','Icon','\u25CF','$text-secondary',20),
    t('O4UR5','Label','Grupo','$text-primary',14),
    t('h19bo2','Chevron','\u25B8','$text-disabled',18)
  ],{width:240,padding:[0,12],gap:12,cornerRadius:8})
],{reusable:true,width:240,height:44}));

// 6. UserArea
doc.children.push(f('I4PeC','UserArea',[
  f('O3RFM4','UserRow',[
    r('jcIOX','Avatar',36,36,'$primary',{cornerRadius:18}),
    f('xmvIX','UserInfo',[
      t('t3DFqD','Name','Admin','$text-primary',14,{fontWeight:'500'}),
      t('Uaiuu','Role','Administrador','$text-secondary',12)
    ],{layout:'vertical',gap:2}),
    t('nsNiY','PinIcon','\uD83D\uDCCC','$text-disabled',16)
  ],{gap:12,alignItems:'center',width:'fill_container'})
],{reusable:true,width:240,height:64,layout:'vertical',padding:[12,16],gap:8}));

// 7. AppBar
doc.children.push(f('HF28R','AppBar',[
  t('F8Peem','MenuIcon','\u2630','$text-primary',22),
  t('wSU9Z','Title','Boilerplate','$text-primary',18,{fontWeight:'500'}),
  f('kR0eC','Spacer',[],{width:'fill_container',height:24}),
  t('QB5OR','SearchIcon','\uD83D\uDD0D','$text-disabled',16),
  t('dwsjA','SearchText','Buscar... \u2318K','$text-disabled',14),
  f('nM8Kb','Actions',[
    t('JbEVB','Icon1','\uD83C\uDF19','$text-primary',20),
    t('gYaQE','Icon2','\uD83C\uDF10','$text-primary',20),
    t('L9nQH2','Icon3','\u2699','$text-primary',20)
  ],{gap:4,alignItems:'center'})
],{reusable:true,width:480,height:56,fill:'$surface',padding:[0,16],gap:12,alignItems:'center'}));

// 8. NavigationDrawer empty
doc.children.push(f('YXr7G','NavigationDrawer',[],{reusable:true,width:240,height:900,layout:'vertical',fill:'$surface'}));

// 9. Breadcrumbs
doc.children.push(f('SwVyr','Breadcrumbs',[
  t('b2AXlp','Home','Home','$text-secondary',13),
  t('jsmPX','Sep1','\u203A','$text-disabled',13),
  t('FKeVw','Current','Pagina','$text-primary',13,{fontWeight:'500'}),
  f('xijy4','Slot',[],{width:100,height:1})
],{reusable:true,width:400,height:20,padding:[0,4],gap:6,alignItems:'center'}));

// 10. GenericCard
doc.children.push(f('v5fbUp','GenericCard',[
  f('orWo3','CardHeader',[
    t('EdRUg','Title','Titulo','$text-primary',24,{fontWeight:'700'}),
    f('CJfpu','Spacer',[],{width:'fill_container',height:1}),
    f('kkbY6','Actions',[],{width:80,height:28})
  ],{gap:12,alignItems:'center',width:'fill_container'}),
  f('BCb71','Content',[],{layout:'vertical',gap:8,width:'fill_container',height:60})
],{reusable:true,width:400,height:200,layout:'vertical',padding:12,gap:16,cornerRadius:12,fill:'$surface'}));

// 11. DialogFiltro
doc.children.push(f('d9eK9Y','DialogFiltro',[
  f('JOKGM','Toolbar',[
    t('iqoT4','MenuIcon','\u2630','#FFFFFF',20),
    t('JS8I8','Title','Filtros','#FFFFFF',16,{fontWeight:'500'}),
    f('mXlzg','Spacer',[],{width:'fill_container',height:1}),
    f('i67A0p','FilterBadge',[
      t('EzAS5','Count','3','#FFFFFF',12)
    ],{padding:[4,8],gap:4,cornerRadius:12,fill:'#1A237E'}),
    t('z4rJk','CloseIcon','\u2715','#FFFFFF',20)
  ],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$primary'})
],{reusable:true,width:300,height:200,layout:'vertical',cornerRadius:12,fill:'$surface'}));

// 12. LOGIN SCREEN
doc.children.push(f('OytcB','Login Screen',[
  r('uOoet','Background',1440,900,'$bg',{layoutPosition:'absolute'}),
  f('d2yix','Login Card',[
    f('j44yH','TabBar',[
      f('D8zRqR','TabLogin',[
        t('oGmx5','Icon','\uD83D\uDD10','$primary',18),
        t('uujUp','Label','Login','$primary',14,{fontWeight:'500'})
      ],{width:'fill_container',padding:[16,16],gap:8,alignItems:'center'}),
      f('qtdbG','TabRegistrar',[
        t('iXQaM','Icon','\uD83D\uDCDD','$text-secondary',18),
        t('ji4Nt','Label','Registrar','$text-secondary',14)
      ],{width:'fill_container',padding:[16,16],gap:8,alignItems:'center'})
    ],{width:'fill_container',fill:'transparent'}),
    f('p6sdo','FormArea',[
      t('n24le','Title','Bem-vindo de volta!','$text-primary',20,{fontWeight:'500'}),
      t('ROmiO','Subtitle','Fa\u00E7a login para continuar','$text-secondary',14),
      f('n23Tt','EmailField',[
        t('ixNHD','Label','E-mail','$text-primary',12,{fontWeight:'500'}),
        f('fJNrD','Input',[],{width:'fill_container',height:44,fill:'$bg',stroke:'$text-disabled',strokeWidth:1,cornerRadius:6,padding:[12,14]})
      ],{layout:'vertical',gap:4,width:'fill_container'}),
      f('gzspW','PasswordField',[
        t('KMW7a','Label','Senha','$text-primary',12,{fontWeight:'500'}),
        f('Gtaqf','Input',[
          t('t6z8z','Value','\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022','$text-primary',14),
          f('PwfA8','Spacer',[],{width:'fill_container',height:1}),
          t('o9QXFE','Toggle','\uD83D\uDC41','$text-disabled',18)
        ],{width:'fill_container',height:44,fill:'$bg',stroke:'$text-disabled',strokeWidth:1,cornerRadius:6,padding:[12,14],gap:8,alignItems:'center'})
      ],{layout:'vertical',gap:4,width:'fill_container'}),
      f('c3XqtE','Actions',[
        t('aahXJ','Spacer','','$text-primary',1),
        ref('iW7jC','BtnEntrar','egrTt',{descendants:{kcM3q:{content:'Entrar'}}}),
        t('isvVu','ForgetLabel','Esqueceu a senha?','$primary',13)
      ],{gap:12,alignItems:'center',width:'fill_container'})
    ],{layout:'vertical',padding:[24,24],gap:20,width:'fill_container'})
  ],{width:520,layout:'vertical',gap:0,cornerRadius:12,fill:'$surface'})
],{width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true,fill:'$bg'}));

// 13. MAIN LAYOUT
doc.children.push(f('nqSD7','Main Layout',[
  f('oI0kP','NavDrawer',[
    ref('CCxMx','UserArea','I4PeC',{width:'fill_container'}),
    r('Rzv6q','Divider',1,1,'$text-disabled',{width:'fill_container'}),
    f('uMqiI','NavList',[
      ...arrMainNav.map(([l,i,h],idx) => f('ni'+idx,'Nav_'+l,[
        t('ic'+idx,'Icon',i,'$text-secondary',18),
        t('lb'+idx,'Label',l,'$text-primary',14),
        f('sp'+idx,'Spacer',[],{width:'fill_container',height:1}),
        t('hk'+idx,'Hotkey',h,'$text-disabled',12)
      ],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8})),
      ...arrSubNav.map(([l,i,h],idx) => f('ns'+idx,'NavSub_'+l,[
        t('is'+idx,'Icon',i,'$text-secondary',18),
        t('ls'+idx,'Label',l,'$text-primary',14)
      ],{width:'fill_container',padding:[12,12,12,36],gap:12,cornerRadius:8}))
    ]),
    f('wFZN0','NavSpacer',[],{width:'fill_container',height:'fill_container'}),
    f('C7sfik','NavLogout',[
      t('fMXZh','Icon','\u23FB','$text-primary',18),
      t('Q38gI','Label','Sair','$text-primary',14)
    ],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8})
  ],{width:240,height:900,layout:'vertical',fill:'$surface'}),
  f('PvLtL','ContentArea',[
    f('J4uvW','AppBar',[
      t('mn1','MenuIcon','\u2630','$text-primary',22),
      t('tt1','Title','Usuarios','$text-primary',18,{fontWeight:'500'}),
      f('sp1','Spacer',[],{width:'fill_container',height:24}),
      t('sr1','SearchIcon','\uD83D\uDD0D','$text-disabled',16),
      t('st1','SearchText','Buscar... \u2318K','$text-disabled',14),
      f('ac1','Actions',[
        t('a1','Icon1','\uD83C\uDF19','$text-primary',20),
        t('a2','Icon2','\uD83C\uDF10','$text-primary',20),
        t('a3','Icon3','\u2699','$text-primary',20)
      ],{gap:4,alignItems:'center'})
    ],{width:'fill_container',height:56,fill:'$surface',padding:[0,24],gap:12,alignItems:'center'}),
    f('XkSuF','MainContent',[
      f('bc1','Breadcrumbs',[
        t('bh1','Home','Home','$text-secondary',13),
        t('bs1','Sep','\u203A','$text-disabled',13),
        t('bc2','Current','Usuarios','$text-primary',13,{fontWeight:'500'})
      ],{width:'fill_container',padding:[0,4],gap:6,alignItems:'center'}),
      f('cc1','ContentCard',[
        f('ct1','CardTitle',[
          t('ctt1','Title','Usuarios','$text-primary',24,{fontWeight:'700'}),
          f('cts1','Spacer',[],{width:'fill_container',height:1})
        ],{gap:12,alignItems:'center',width:'fill_container'}),
        f('gd1','GridChart',[
          f('lc1','LeftCol',[
            f('th1','TableHeader',[
              t('to1','Order','\u21C5','$text-primary',16),
              f('ts1','Spacer',[],{width:'fill_container',height:1}),
              t('te1','Export','\u2197','$text-secondary',16),
              t('tx1','Toggle','\u25D4','$text-secondary',16),
              t('tp1','Add','+','#FFFFFF',20),
              t('ta1','AddLabel','Novo','#FFFFFF',14)
            ],{gap:8,alignItems:'center',width:'fill_container'}),
            f('tr1','TableHeaderRow',[
              t('h1','H_Nome','Nome','$text-secondary',12,{fontWeight:'500'}),
              t('h2','H_Email','E-mail','$text-secondary',12,{fontWeight:'500'}),
              t('h3','H_Status','Status','$text-secondary',12,{fontWeight:'500'}),
              t('h4','H_Cargo','Cargo','$text-secondary',12,{fontWeight:'500'}),
              t('h5','H_Acoes','Acoes','$text-secondary',12,{fontWeight:'500'})
            ],{gap:8,width:'fill_container',alignItems:'center'}),
            ...arrRows.map((nome,i) =>
              f('rw'+i,'Row_'+nome,[
                t('rn'+i,'Name',nome,'$text-primary',14),
                t('re'+i,'Email',nome.toLowerCase().replace(' ','.')+'@email.com','$text-secondary',13),
                t('rs'+i,'Status','Ativo','$success',12),
                t('rc'+i,'Cargo',['Administrador','Usuario','Usuario'][i],'$text-primary',13),
                t('ra'+i,'Acoes','\u270E \u2715','$text-secondary',16)
              ],{gap:8,padding:[8,8],width:'fill_container',alignItems:'center'})
            )
          ],{layout:'vertical',gap:8,width:'fill_container'}),
          f('rc1','RightCol',[
            t('ct2','ChartTitle','Usuarios por Cargo','$text-primary',16,{fontWeight:'500'}),
            f('dg1','DonutChart',[
              {type:'ellipse',id:'de1',name:'Donut1',width:160,height:160,fill:'$primary',innerRadius:0.6,sweepAngle:180},
              {type:'ellipse',id:'de2',name:'Donut2',width:160,height:160,fill:'$success',innerRadius:0.6,startAngle:180,sweepAngle:120},
              {type:'ellipse',id:'de3',name:'Donut3',width:160,height:160,fill:'$warning',innerRadius:0.6,startAngle:300,sweepAngle:60}
            ],{width:160,height:160,layout:'none'}),
            f('lg1','Legend',arrLegends.map(([l,c,v]) =>
              f('li_'+l,'Leg_'+l,[
                r('lc_'+l,'Color',10,10,c,{cornerRadius:2}),
                t('ll_'+l,'Label',l,'$text-primary',13),
                f('ls_'+l,'Spacer',[],{width:'fill_container',height:1}),
                t('lv_'+l,'Value',v,'$text-primary',13,{fontWeight:'500'})
              ],{gap:8,alignItems:'center',width:'fill_container'})
            ))
          ],{layout:'vertical',gap:12,width:360,padding:[12,0],fill:'$surface'})
        ],{gap:16,width:'fill_container'})
      ],{layout:'vertical',padding:12,gap:16,cornerRadius:12,fill:'$surface',width:'fill_container'})
    ],{layout:'vertical',padding:[24,24],gap:16,width:'fill_container',height:'fill_container'})
  ],{width:'fill_container',height:900,layout:'vertical',fill:'$bg'})
],{width:1440,height:900,layout:'horizontal',clip:true,fill:'$bg'}));

// 14. ERROR 500 PAGE
doc.children.push(f('p7egY','Error 500 Page',[
  r('kWRYo','Overlay',1440,900,'$bg',{layoutPosition:'absolute'}),
  f('KC9XO','ErrorContent',[
    t('P4FQ2','ErrorIcon','\u26A0','$error',64),
    t('nTU9f','Code','500','$text-primary',72,{fontWeight:'700'}),
    t('QA1r7','Title','Erro Interno','$text-primary',24,{fontWeight:'500'}),
    t('IM5qd','Message','Algo deu errado nos nossos servidores. Tente novamente mais tarde.','$text-secondary',14,{width:400,textGrowth:'fixed-width'}),
    f('zQOFU','ButtonRow',[
      ref('hkfjf','BtnVoltar','A55RDh',{descendants:{ZwuxH:{content:'Voltar'}}}),
      ref('J6d9U','BtnInicio','egrTt',{descendants:{kcM3q:{content:'Ir para o Inicio'}}})
    ],{gap:12,alignItems:'center'})
  ],{layout:'vertical',gap:16,alignItems:'center',justifyContent:'center'})
],{width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true,fill:'$bg'}));

// 15. DIALOG FILTROS SCREEN
doc.children.push(f('ETAwZ','DialogFiltros Screen',[
  r('MDVhA','Backdrop',1440,900,'#000000',{opacity:0.5,layoutPosition:'absolute'}),
  f('aEc23','DialogBox',[
    f('q8DSV','Toolbar',[
      t('j9T7X','MenuIcon','\u2630','#FFFFFF',20),
      t('fK0pW','Title','Filtros','#FFFFFF',16,{fontWeight:'500'}),
      f('QCDdw','Spacer1',[],{width:'fill_container',height:1}),
      f('uQ4CQ','FilterBadge',[
        t('M3zvpz','Count','3','#FFFFFF',12)
      ],{padding:[4,8],cornerRadius:12,fill:'#1A237E'}),
      t('rSrrX','CloseIcon','\u2715','#FFFFFF',20)
    ],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$primary'}),
    f('Y3w5Tl','DialogBody',[
      f('JtVoW','LeftDrawer',[
        f('IIBV2','SearchBox',[
          t('xGC6n','Icon','\uD83D\uDD0D','$text-disabled',16),
          t('EUoqt','Text','Buscar campo...','$text-disabled',13)
        ],{padding:[8,10],gap:8,cornerRadius:6,strokeWidth:1,stroke:'$text-disabled',fill:'$bg',width:'fill_container'}),
        ...arrFiltro.map((fld,i) =>
          f('fl_'+i,'Field_'+fld,[
            t('fi_'+i,'Icon','\u25CF','$text-secondary',16),
            t('fl_'+i,'Label',fld,'$text-primary',13)
          ],{padding:[8,10],gap:8,cornerRadius:6,width:'fill_container'})
        )
      ],{layout:'vertical',width:240,fill:'$surface',padding:[8,8],gap:4}),
      f('dKR4M','MainContent',[
        t('g5Q00','Selected','Nome','$text-primary',16,{fontWeight:'500'}),
        t('EaWo3','Type','Tipo: Texto','$text-secondary',12),
        f('kJ3MM','FormFiltro',[
          t('H1kak','Operador','Contem','$text-primary',13),
          t('Ft1t6','Value','Digite o valor...','$text-disabled',13),
          ref('Olqw5','BtnAdd','egrTt',{descendants:{kcM3q:{content:'Adicionar'}}})
        ],{gap:8,alignItems:'center',width:'fill_container'})
      ],{layout:'vertical',padding:[16,16],gap:16,width:'fill_container',fill:'$bg'}),
      f('BhJKO','RightDrawer',[
        f('xDqn2','RightHeader',[
          t('FyipM','Title','Filtros Aplicados','$text-primary',13,{fontWeight:'500'}),
          f('n02Dn','Spacer',[],{width:'fill_container',height:1})
        ],{gap:8,alignItems:'center',width:'fill_container',padding:[8,0]}),
        ...arrFiltrosAplicados.map((v,i) =>
          f('af_'+i,'AF_'+v,[
            t('afc_'+i,'Valor',v,'$text-primary',12,{fontWeight:'500'}),
            t('afe_'+i,'Edit','\u270E','$text-secondary',16),
            t('afd_'+i,'Delete','\u2715','$text-secondary',16)
          ],{padding:[8,8],gap:6,cornerRadius:6,strokeWidth:1,stroke:'$text-disabled',width:'fill_container'})
        )
      ],{layout:'vertical',width:240,fill:'$surface',padding:[8,8],gap:4})
    ],{gap:0,width:'fill_container',height:480}),
    f('q5VFI','Actions',[
      ref('NUujo','BtnCancel','em8r1',{descendants:{uk26E:{content:'Cancelar'}}}),
      f('L3IhB','Spacer2',[],{width:'fill_container',height:1}),
      t('GAOwn','Clear','Limpar Filtros','$error',14),
      ref('s8Y3gw','BtnAplicar','egrTt',{descendants:{kcM3q:{content:'Aplicar'}}})
    ],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$surface'})
  ],{width:1050,layout:'vertical',cornerRadius:12,fill:'$surface'})
],{width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true,fill:'$bg'}));

// 16. MOBILE LAYOUT
doc.children.push(f('JMiM2','Mobile Layout',[
  r('RLZXQ','Overlay',390,844,'$bg',{layoutPosition:'absolute'}),
  f('P9XCkk','TemporaryDrawer',[
    f('pp0Sw','UserArea',[
      r('ma1','Avatar',36,36,'$primary',{cornerRadius:18}),
      t('mn1name','Name','Admin','$text-primary',14,{fontWeight:'500'}),
      t('mr1role','Role','Administrador','$text-secondary',12)
    ],{gap:12,padding:[16,16],alignItems:'center',width:'fill_container'}),
    r('MV8NO','Divider',1,1,'$text-disabled',{width:'fill_container'}),
    f('cKPG3','NavList',[
      ...arrMobileNav.map(([l,i],idx) =>
        f('mni'+idx,'Nav_'+l,[
          t('mii'+idx,'Icon',i,'$text-secondary',18),
          t('mli'+idx,'Label',l,'$text-primary',14)
        ],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8})
      ),
      f('mlo1','Nav_Logout',[
        t('mlo1i','Icon','\u23FB','$text-primary',18),
        t('mlo1l','Label','Sair','$text-primary',14)
      ],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8})
    ])
  ],{width:280,height:844,layout:'vertical',fill:'$surface'}),
  f('oAVk1','Main',[
    f('inK96','AppBar',[
      f('pWTR7','AppBarTop',[
        t('bm1','MenuIcon','\u2630','$text-primary',22),
        t('vt1','Title','Usuarios','$text-primary',16,{fontWeight:'500'}),
        f('cs1','Spacer',[],{width:'fill_container',height:1}),
        t('ix1','Icon1','\uD83C\uDF19','$text-primary',20),
        t('ix2','Icon2','\u2699','$text-primary',20)
      ],{padding:[8,12],gap:8,alignItems:'center',width:'fill_container'}),
      f('sMbfA','Extension',[
        t('si1','Search','\uD83D\uDD0D  Buscar...','$text-disabled',13)
      ],{padding:[4,12,8,12],width:'fill_container'})
    ],{layout:'vertical',width:'fill_container',fill:'$surface'}),
    f('fgFci','Content',[
      f('SajYQ','Card',[
        f('QIPEN','CardHeader',[
          t('xt1','Title','Usuarios','$text-primary',18,{fontWeight:'700'}),
          f('ys1','Spacer',[],{width:'fill_container',height:1}),
          t('ai1','Add','+','$primary',20)
        ],{gap:8,alignItems:'center',width:'fill_container'}),
        ...arrRows.map((n,i) =>
          f('mr'+i,'Row_'+n,[
            r('mav'+i,'Avatar',36,36,'$primary',{cornerRadius:18}),
            t('mn2_'+i,'Name',n,'$text-primary',14,{fontWeight:'500'}),
            t('ms1_'+i,'Status','Ativo','$success',12),
            t('me1_'+i,'Edit','\u270E','$text-secondary',18),
            t('md1_'+i,'Delete','\u2715','$text-secondary',18)
          ],{gap:12,alignItems:'center',width:'fill_container'})
        )
      ],{layout:'vertical',padding:12,gap:12,cornerRadius:12,fill:'$surface',width:'fill_container'})
    ],{layout:'vertical',padding:[12,12],gap:12,width:'fill_container'})
  ],{width:'fill_container',height:'fill_container',layout:'vertical'})
],{width:390,height:844,layout:'horizontal',clip:true,fill:'$bg'}));

// 17. COMPACT RAIL LAYOUT
doc.children.push(f('X5AHc','Compact Rail Layout',[
  r('Cv18D','Bg',1440,900,'$bg',{layoutPosition:'absolute'}),
  f('hbLrj','RailDrawer',[
    r('Rm1Q','Avatar',36,36,'$primary',{cornerRadius:18}),
    r('Od1','Divider',40,1,'$text-disabled'),
    ...arrRailIcons.map((icon,i) =>
      f('ri_'+i,'RIcon_'+i,[
        t('ri_icon_'+i,'Icon',icon,'$text-secondary',18)
      ],{padding:[14,12],cornerRadius:8})
    ),
    r('Hd1','Divider2',40,1,'$text-disabled'),
    f('xp4nI','Spacer',[],{width:1,height:'fill_container'}),
    t('ri_logout','Logout','\u23FB','$text-primary',18)
  ],{width:64,height:900,layout:'vertical',fill:'$surface',alignItems:'center',gap:4,padding:[0,8]}),
  f('J9AJpY','MainContent',[
    f('HccWu','AppBar',[
      t('Tm1','MenuIcon','\u2630','$text-primary',22),
      t('Qm1','Title','Usuarios','$text-primary',18,{fontWeight:'500'}),
      f('zr1','Spacer',[],{width:'fill_container',height:1}),
      t('Uk1','Icon1','\uD83C\uDF19','$text-primary',20),
      t('nz1','Icon2','\u2699','$text-primary',20)
    ],{padding:[0,24],gap:12,alignItems:'center',width:'fill_container',fill:'$surface'}),
    f('bc3','Breadcrumbs',[
      t('bh2','Home','Home','$text-secondary',13),
      t('bs2','Sep','\u203A','$text-disabled',13),
      t('bc4','Current','Usuarios','$text-primary',13,{fontWeight:'500'})
    ],{width:'fill_container',padding:[0,4],gap:6,alignItems:'center'}),
    f('ck1','ContentCard',[
      t('ct3','Title','Usuarios','$text-primary',24,{fontWeight:'700'}),
      t('ct4','Desc','Selecione um usuario para ver detalhes','$text-secondary',14)
    ],{layout:'vertical',padding:12,gap:16,cornerRadius:12,fill:'$surface',width:'fill_container'})
  ],{width:'fill_container',height:900,layout:'vertical',padding:[24,24],gap:16}),
  f('oEZF8','HoverTooltip',[
    t('Ksjv','Label','Usuarios','$text-primary',14),
    t('E4dl','Hotkey','\u2318\u21E7U','$text-disabled',12)
  ],{width:180,height:48,layout:'vertical',padding:8,gap:2,cornerRadius:8,fill:'$surface',layoutPosition:'absolute',x:68,y:200})
],{width:1440,height:900,layout:'horizontal',clip:true,fill:'$bg'}));

fs.writeFileSync('boilerplate.pen', JSON.stringify(doc, null, 2), 'utf8');
console.log('OK! '+doc.children.length+' children.');
