const fs = require('fs');

var _cid = 0;
function uid() { return 'n' + (++_cid); }

// helpers com nomes longos para legibilidade no JSON
var T = { type:'text' };
var F = { type:'frame' };
var R = { type:'rectangle' };
var RF = { type:'ref' };

function txt(content, fill, size, extra) {
  var o = { type:'text', id:uid(), content:content, fill:fill||'$text-primary', fontSize:size||14, fontFamily:'Roboto' };
  if (extra) for (var k in extra) o[k] = extra[k];
  return o;
}

function frame(children, extra) {
  var o = { type:'frame', id:uid(), children:children };
  if (extra) for (var k in extra) o[k] = extra[k];
  return o;
}

function rect(w, h, fill, extra) {
  var o = { type:'rectangle', id:uid(), width:w, height:h, fill:fill||'$surface' };
  if (extra) for (var k in extra) o[k] = extra[k];
  return o;
}

function reff(refId, extra) {
  var o = { type:'ref', id:uid(), ref:refId };
  if (extra) for (var k in extra) o[k] = extra[k];
  return o;
}

// Cores tema escuro (extraidas via Playwright)
var doc = {
  version:'2.14',
  fileToken:'c5ae3c77-6fab-4962-9e0a-1bb13d7b0eed',
  variables:{
    bg:{type:'color',value:[{value:'#0f1117',theme:{mode:'dark'}}]},
    surface:{type:'color',value:[{value:'#1a1d27',theme:{mode:'dark'}}]},
    primary:{type:'color',value:[{value:'#5C6BC0',theme:{mode:'dark'}}]},
    secondary:{type:'color',value:[{value:'#9FA8DA',theme:{mode:'dark'}}]},
    error:{type:'color',value:[{value:'#EF5350',theme:{mode:'dark'}}]},
    success:{type:'color',value:[{value:'#66BB6A',theme:{mode:'dark'}}]},
    warning:{type:'color',value:[{value:'#FFA726',theme:{mode:'dark'}}]},
    info:{type:'color',value:[{value:'#42A5F5',theme:{mode:'dark'}}]},
    'text-primary':{type:'color',value:[{value:'#FFFFFF',theme:{mode:'dark'}}]},
    'text-secondary':{type:'color',value:[{value:'#B0B0B0',theme:{mode:'dark'}}]},
    'text-disabled':{type:'color',value:[{value:'#666666',theme:{mode:'dark'}}]},
    'divider':{type:'color',value:[{value:'#2E3144',theme:{mode:'dark'}}]},
    'font-family':{type:'string',value:'Roboto'},
  },
  children:[],
};

// ============ COMPONENTES REUTILIZAVEIS ============

// 1. BtnPrimary
doc.children.push(frame([txt('Button','#FFFFFF',14,{fontWeight:'500'})],{id:uid(),name:'BtnPrimary',reusable:true,width:100,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'}));

// 2. BtnOutline
doc.children.push(frame([txt('Button','$primary',14,{fontWeight:'500'})],{id:uid(),name:'BtnOutline',reusable:true,width:100,height:36,fill:'transparent',padding:[8,20],gap:8,cornerRadius:6,stroke:'$primary',strokeWidth:1,layout:'horizontal',alignItems:'center',justifyContent:'center'}));

// 3. BtnDanger
doc.children.push(frame([txt('Button','#FFFFFF',14,{fontWeight:'500'})],{id:uid(),name:'BtnDanger',reusable:true,width:100,height:36,fill:'$error',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'}));

// 4. DrawerItemUsuario
doc.children.push(frame([frame([rect(36,36,'$primary',{cornerRadius:18}),frame([txt('Admin','$text-primary',14,{fontWeight:'500'}),txt('ADMINISTRADOR','$text-secondary',11)],{layout:'vertical',gap:2}),txt('\uD83D\uDCCC','$primary',16)],{gap:12,alignItems:'center',width:'fill_container',layout:'horizontal'})],{id:uid(),name:'DrawerItemUsuario',reusable:true,width:256,height:64,layout:'vertical',padding:[12,16],gap:8}));

// 5. DrawerItemNavigation
doc.children.push(frame([txt('\u25CF','$text-secondary',18),txt('Item','$text-primary',14),frame([],{width:'fill_container',height:1}),txt('\u2318\u21E7H','$text-disabled',12)],{id:uid(),name:'DrawerItemNavigation',reusable:true,width:256,height:44,padding:[0,12],gap:12,cornerRadius:8,layout:'horizontal',alignItems:'center'}));

// 6. AppBar
doc.children.push(frame([txt('\u2630','$text-primary',22),txt('Boilerplate','$text-primary',18,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),txt('\uD83D\uDD0D','$text-disabled',16),txt('Buscar...','$text-disabled',14),frame([txt('\uD83C\uDF19','$text-primary',20),txt('\uD83C\uDF10','$text-primary',20),txt('\u2699','$text-primary',20)],{gap:4,alignItems:'center',layout:'horizontal'})],{id:uid(),name:'AppBar',reusable:true,width:500,height:64,fill:'$surface',padding:[0,16],gap:12,alignItems:'center',layout:'horizontal'}));

// 7. Breadcrumbs
doc.children.push(frame([txt('Home','$text-secondary',13),txt('/','$text-disabled',13),txt('Administrator','$text-secondary',13),txt('/','$text-disabled',13),txt('Current','$text-primary',13,{fontWeight:'500'})],{id:uid(),name:'Breadcrumbs',reusable:true,width:500,height:20,padding:[0,4],gap:6,alignItems:'center',layout:'horizontal'}));

// 8. GenericCard
doc.children.push(frame([frame([txt('Title','$text-primary',24,{fontWeight:'700'}),frame([],{width:'fill_container',height:1}),txt('+','#FFFFFF',20),txt('Novo','#FFFFFF',14)],{gap:12,alignItems:'center',width:'fill_container',layout:'horizontal'}),frame([],{layout:'vertical',gap:8,width:'fill_container',height:120})],{id:uid(),name:'GenericCard',reusable:true,width:500,height:200,layout:'vertical',padding:12,gap:16,cornerRadius:12,fill:'$surface'}));

// 9. BaseDialog
doc.children.push(frame([frame([txt('\u2630','#FFFFFF',20),txt('Dialog','#FFFFFF',16,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),txt('\u2715','#FFFFFF',20)],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$primary',layout:'horizontal'}),frame([txt('Content here','$text-primary',14)],{layout:'vertical',padding:[24,24],gap:16,width:'fill_container',fill:'$bg'}),frame([txt('Cancel','#FFFFFF',14),frame([],{width:'fill_container',height:1}),txt('Confirm','#FFFFFF',14)],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$surface',layout:'horizontal'})],{id:uid(),name:'BaseDialog',reusable:true,width:480,height:300,layout:'vertical',cornerRadius:12,fill:'$surface'}));

// 10. DonutChart
doc.children.push(frame([{type:'ellipse',id:uid(),width:160,height:160,fill:'$primary',innerRadius:0.6,sweepAngle:180},{type:'ellipse',id:uid(),width:160,height:160,fill:'$success',innerRadius:0.6,startAngle:180,sweepAngle:120},{type:'ellipse',id:uid(),width:160,height:160,fill:'$warning',innerRadius:0.6,startAngle:300,sweepAngle:60}],{id:uid(),name:'DonutChart',reusable:true,width:160,height:160,layout:'none'}));

// ============ SCREENS ============

// ---- helpers para evitar repeticao ----
function navItem(icon, label, hotkey, indent) {
  var pad = indent ? [12,12,12,36] : [12,12];
  return frame([txt(icon,'$text-secondary',18),txt(label,'$text-primary',14),frame([],{width:'fill_container',height:1}),txt(hotkey,'$text-disabled',12)],{width:'fill_container',padding:pad,gap:12,cornerRadius:8,layout:'horizontal',alignItems:'center'});
}

function userRow(avatar, name, role) {
  return frame([rect(avatar,avatar,'$primary',{cornerRadius:avatar/2}),frame([txt(name,'$text-primary',14,{fontWeight:'500'}),txt(role,'$text-secondary',11)],{layout:'vertical',gap:2}),txt('\uD83D\uDCCC','$primary',16)],{gap:12,alignItems:'center',width:'fill_container',layout:'horizontal'});
}

// 11. LOGIN SCREEN
var loginCard = frame([
  frame([frame([txt('\uD83D\uDD10','$primary',18),txt('Acessar sistema','$primary',14,{fontWeight:'500'})],{width:'fill_container',padding:[16,16],gap:8,alignItems:'center',layout:'horizontal'}),frame([txt('\uD83D\uDCDD','$text-secondary',18),txt('Registrar','$text-secondary',14)],{width:'fill_container',padding:[16,16],gap:8,alignItems:'center',layout:'horizontal'})],{width:'fill_container',fill:'transparent',layout:'horizontal'}),
  frame([
    txt('Bem-vindo de volta!','$text-primary',20,{fontWeight:'500'}),
    txt('Fa\u00E7a login para continuar','$text-secondary',14),
    frame([txt('E-mail','$text-primary',12,{fontWeight:'500'}),frame([],{width:'fill_container',height:44,fill:'$bg',stroke:'$text-disabled',strokeWidth:1,cornerRadius:6,padding:[12,14]})],{layout:'vertical',gap:4,width:'fill_container'}),
    frame([txt('Senha','$text-primary',12,{fontWeight:'500'}),frame([txt('\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022','$text-primary',14),frame([],{width:'fill_container',height:1}),txt('\uD83D\uDC41','$text-disabled',18)],{width:'fill_container',height:44,fill:'$bg',stroke:'$text-disabled',strokeWidth:1,cornerRadius:6,padding:[12,14],gap:8,alignItems:'center',layout:'horizontal'})],{layout:'vertical',gap:4,width:'fill_container'}),
    frame([frame([txt('Entrar','#FFFFFF',14,{fontWeight:'500'})],{width:90,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'}),txt('Esqueci minha senha','$primary',13)],{gap:12,alignItems:'center',width:'fill_container',layout:'horizontal'}),
    frame([rect(1,1,'$text-disabled',{width:'fill_container'}),txt('ou','$text-disabled',13),rect(1,1,'$text-disabled',{width:'fill_container'})],{gap:12,alignItems:'center',width:'fill_container',layout:'horizontal'}),
    frame([txt('G','$text-primary',18),txt('Google','$text-secondary',14)],{width:'fill_container',height:40,cornerRadius:6,stroke:'$text-disabled',strokeWidth:1,alignItems:'center',justifyContent:'center',gap:8,layout:'horizontal'}),
  ],{layout:'vertical',padding:[24,24],gap:20,width:'fill_container'}),
],{width:520,layout:'vertical',gap:0,cornerRadius:12,fill:'$surface'});

doc.children.push(frame([rect(1440,900,'$bg'),loginCard],{name:'Login Screen',width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true}));

// 12. MAIN LAYOUT
var navContent = frame([navItem('\u2302','Home','\u2318\u21E7H'),navItem('\u2B21','Dashboard','\u2318\u21E7D'),frame([txt('\u2699','$primary',18),txt('Administrator','$primary',14,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),txt('\u2318\u21E7A','$text-disabled',12),txt('\u25BC','$text-disabled',12)],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8,layout:'horizontal',alignItems:'center'}),navItem('\uD83D\uDC65','Usuarios','\u2318\u21E7U',true),navItem('\uD83D\uDD11','RBAC','\u2318\u21E7R',true),navItem('\u26A0','Errors','\u2318\u21E7E',true),navItem('\u2665','Health Check','\u2318\u21E7C',true),frame([txt('\u23FB','$text-secondary',18),txt('Logout','$text-primary',14)],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8,layout:'horizontal',alignItems:'center'})]);

var navDrawer = frame([userRow(36,'Admin','ADMINISTRADOR'),rect(1,1,'$divider',{width:'fill_container'}),navContent],{width:256,height:'fill_container',layout:'vertical',fill:'$surface'});

var tableRowsData = [
  {n:'Jo\u00E3o Silva',e:'joao.silva@email.com',s:'Ativo',c:'Administrador'},
  {n:'Maria Santos',e:'maria.santos@email.com',s:'Ativo',c:'Usu\u00E1rio'},
  {n:'Pedro Costa',e:'pedro.costa@email.com',s:'Inativo',c:'Usu\u00E1rio'},
  {n:'Ana Oliveira',e:'ana.oliveira@email.com',s:'Ativo',c:'Administrador'},
  {n:'Lucas Pereira',e:'lucas.pereira@email.com',s:'Ativo',c:'Usu\u00E1rio'},
];

var headerRow = frame([txt('Nome','$text-secondary',12,{fontWeight:'500'}),txt('E-mail','$text-secondary',12,{fontWeight:'500'}),txt('Status','$text-secondary',12,{fontWeight:'500'}),txt('Cargo','$text-secondary',12,{fontWeight:'500'}),txt('A\u00E7\u00F5es','$text-secondary',12,{fontWeight:'500'})],{gap:8,padding:[8,0],width:'fill_container',alignItems:'center',layout:'horizontal'});

var dataRows = tableRowsData.map(function(r) {
  return frame([rect(28,28,'$primary',{cornerRadius:14}),txt(r.n,'$text-primary',14),txt(r.e,'$text-secondary',13),txt(r.s,r.s==='Ativo'?'$success':'$text-disabled',12),txt(r.c,'$text-primary',13),txt('\u270E \u2715','$text-secondary',16)],{gap:8,padding:[8,0],width:'fill_container',alignItems:'center',layout:'horizontal'});
});

var dataTable = frame([headerRow,rect(1,1,'$divider',{width:'fill_container'})].concat(dataRows),{layout:'vertical',gap:4,width:'fill_container'});

var donut = frame([
  {type:'ellipse',id:uid(),width:160,height:160,fill:'$primary',innerRadius:0.6,sweepAngle:180},
  {type:'ellipse',id:uid(),width:160,height:160,fill:'$success',innerRadius:0.6,startAngle:180,sweepAngle:120},
  {type:'ellipse',id:uid(),width:160,height:160,fill:'$warning',innerRadius:0.6,startAngle:300,sweepAngle:60},
],{width:160,height:160,layout:'none'});

var legends = [['Admin','$primary','12'],['Usu\u00E1rios','$success','28'],['Convidados','$warning','5']].map(function(l) {
  return frame([rect(10,10,l[1],{cornerRadius:2}),txt(l[0],'$text-primary',13),frame([],{width:'fill_container',height:1}),txt(l[2],'$text-primary',13,{fontWeight:'500'})],{gap:8,alignItems:'center',width:'fill_container',layout:'horizontal'});
});

var chartCol = frame([txt('Usu\u00E1rios por Cargo','$text-primary',16,{fontWeight:'500'}),donut].concat(legends),{layout:'vertical',gap:12,width:280,padding:[12,0,0,12]});

var cardHeader = frame([txt('Usu\u00E1rios','$text-primary',24,{fontWeight:'700'}),frame([],{width:'fill_container',height:1}),txt('\u2197','$text-secondary',16),txt('\u25D4','$text-secondary',16),txt('+','#FFFFFF',20),txt('Novo','#FFFFFF',14)],{gap:8,alignItems:'center',width:'fill_container',layout:'horizontal'});

var contentCard = frame([cardHeader,frame([dataTable,chartCol],{gap:16,width:'fill_container',layout:'horizontal'})],{layout:'vertical',padding:12,gap:16,cornerRadius:12,fill:'$surface',width:'fill_container'});

var crumbs = frame([txt('Home','$text-secondary',13),txt('/','$text-disabled',13),txt('Administrator','$text-secondary',13),txt('/','$text-disabled',13),txt('User Management','$text-primary',13,{fontWeight:'500'})],{width:'fill_container',padding:[0,4],gap:6,alignItems:'center',layout:'horizontal'});

var appbar = frame([txt('\u2630','$text-primary',22),txt('Boilerplate','$text-primary',18,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),txt('\uD83D\uDD0D','$text-disabled',16),txt('Buscar...','$text-disabled',14),frame([txt('\uD83C\uDF19','$text-primary',20),txt('\uD83C\uDF10','$text-primary',20),txt('\u2699','$text-primary',20)],{gap:4,alignItems:'center',layout:'horizontal'})],{width:'fill_container',height:64,fill:'$surface',padding:[0,24],gap:12,alignItems:'center',layout:'horizontal'});

var mainContent = frame([crumbs,contentCard],{layout:'vertical',padding:[24,24],gap:16,width:'fill_container',height:'fill_container',overflow:'auto'});

var contentArea = frame([appbar,mainContent],{width:'fill_container',height:900,layout:'vertical',fill:'$bg'});

doc.children.push(frame([navDrawer,contentArea],{name:'Main Layout - Admin > Usuarios',width:1440,height:900,layout:'horizontal',clip:true}));

// 13. ERROR 500
var errCard500 = frame([txt('\u26A0','$error',64),txt('500','$text-primary',72,{fontWeight:'700'}),txt('Erro Interno','$text-primary',24,{fontWeight:'500'}),txt('Algo deu errado nos servidores. Tente novamente.','$text-secondary',14,{width:400,textGrowth:'fixed-width'}),frame([frame([txt('Voltar','$primary',14,{fontWeight:'500'})],{width:100,height:36,fill:'transparent',padding:[8,20],gap:8,cornerRadius:6,stroke:'$primary',strokeWidth:1,layout:'horizontal',alignItems:'center',justifyContent:'center'}),frame([txt('Ir para o In\u00EDcio','#FFFFFF',14,{fontWeight:'500'})],{width:130,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'})],{gap:12,alignItems:'center',layout:'horizontal'})],{layout:'vertical',gap:16,alignItems:'center',justifyContent:'center'});
doc.children.push(frame([rect(1440,900,'$bg'),errCard500],{name:'Error 500 Page',width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true}));

// 14. ERROR 404
var errCard404 = frame([txt('\u2049','$warning',64),txt('404','$text-primary',72,{fontWeight:'700'}),txt('P\u00E1gina n\u00E3o encontrada','$text-primary',24,{fontWeight:'500'}),txt('A p\u00E1gina que procura n\u00E3o existe ou foi movida.','$text-secondary',14,{width:400,textGrowth:'fixed-width'}),frame([frame([txt('Voltar','$primary',14,{fontWeight:'500'})],{width:100,height:36,fill:'transparent',padding:[8,20],gap:8,cornerRadius:6,stroke:'$primary',strokeWidth:1,layout:'horizontal',alignItems:'center',justifyContent:'center'}),frame([txt('Ir para o In\u00EDcio','#FFFFFF',14,{fontWeight:'500'})],{width:130,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'})],{gap:12,alignItems:'center',layout:'horizontal'})],{layout:'vertical',gap:16,alignItems:'center',justifyContent:'center'});
doc.children.push(frame([rect(1440,900,'$bg'),errCard404],{name:'Error 404 Page',width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true}));

// 15. DIALOG FILTROS
var filtroFields = ['Nome','E-mail','CPF','Telefone','Cargo'].map(function(f) {
  return frame([txt('\u25CF','$text-secondary',16),txt(f,'$text-primary',13)],{padding:[8,10],gap:8,cornerRadius:6,width:'fill_container',layout:'horizontal'});
});

var aplicados = ['Nome: Jo\u00E3o','Status: Ativo','Cargo: Admin'].map(function(v) {
  return frame([txt(v,'$text-primary',12,{fontWeight:'500'}),txt('\u270E','$text-secondary',16),txt('\u2715','$text-secondary',16)],{padding:[8,8],gap:6,cornerRadius:6,strokeWidth:1,stroke:'$text-disabled',width:'fill_container',layout:'horizontal'});
});

var dlg = frame([
  frame([txt('\u2630','#FFFFFF',20),txt('Filtros','#FFFFFF',16,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),frame([txt('3','#FFFFFF',12)],{padding:[4,8],cornerRadius:12,fill:'#1A237E'}),txt('\u2715','#FFFFFF',20)],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$primary',layout:'horizontal'}),
  frame([
    frame([frame([txt('\uD83D\uDD0D','$text-disabled',16),txt('Buscar campo...','$text-disabled',13)],{padding:[8,10],gap:8,cornerRadius:6,strokeWidth:1,stroke:'$text-disabled',fill:'$bg',width:'fill_container',layout:'horizontal'})].concat(filtroFields),{layout:'vertical',width:240,fill:'$surface',padding:[8,8],gap:4}),
    frame([txt('Nome','$text-primary',16,{fontWeight:'500'}),txt('Tipo: Texto','$text-secondary',12),frame([txt('Cont\u00E9m','$text-primary',13),txt('Digite o valor...','$text-disabled',13),frame([txt('Adicionar','#FFFFFF',14,{fontWeight:'500'})],{width:90,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'})],{gap:8,alignItems:'center',width:'fill_container',layout:'horizontal'})],{layout:'vertical',padding:[16,16],gap:16,width:'fill_container',fill:'$bg'}),
    frame([frame([txt('Filtros Aplicados','$text-primary',13,{fontWeight:'500'}),frame([],{width:'fill_container',height:1})],{gap:8,alignItems:'center',width:'fill_container',padding:[8,0],layout:'horizontal'})].concat(aplicados),{layout:'vertical',width:240,fill:'$surface',padding:[8,8],gap:4}),
  ],{gap:0,width:'fill_container',height:480,layout:'horizontal'}),
  frame([frame([txt('Cancelar','#FFFFFF',14,{fontWeight:'500'})],{width:100,height:36,fill:'$error',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'}),frame([],{width:'fill_container',height:1}),txt('Limpar Filtros','$error',14),frame([txt('Aplicar','#FFFFFF',14,{fontWeight:'500'})],{width:90,height:36,fill:'$primary',padding:[8,20],gap:8,cornerRadius:6,layout:'horizontal',alignItems:'center',justifyContent:'center'})],{padding:[12,16],gap:8,alignItems:'center',width:'fill_container',fill:'$surface',layout:'horizontal'}),
],{width:1050,layout:'vertical',cornerRadius:12,fill:'$surface'});

doc.children.push(frame([rect(1440,900,'#000000',{opacity:0.5}),dlg],{name:'DialogFiltros Screen',width:1440,height:900,layout:'vertical',justifyContent:'center',alignItems:'center',clip:true}));

// 16. MOBILE LAYOUT
var mobNavItems = [['Inicio','\u2302'],['Dashboard','\u2B21'],['Admin','\u2699'],['Usuarios','\uD83D\uDC65'],['RBAC','\uD83D\uDD11'],['Erros','\u26A0'],['Health Check','\u2665']].map(function(a) {
  return frame([txt(a[1],'$text-secondary',18),txt(a[0],'$text-primary',14)],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8,layout:'horizontal',alignItems:'center'});
});

var mobDrawer = frame([frame([rect(40,40,'$primary',{cornerRadius:20}),txt('Admin','$text-primary',14,{fontWeight:'500'}),txt('ADMIN','$text-secondary',12)],{gap:12,padding:[16,16],alignItems:'center',width:'fill_container',layout:'horizontal'}),rect(1,1,'$divider',{width:'fill_container'}),frame(mobNavItems.concat([frame([txt('\u23FB','$text-primary',18),txt('Sair','$text-primary',14)],{width:'fill_container',padding:[12,12],gap:12,cornerRadius:8,layout:'horizontal',alignItems:'center'})]),{layout:'vertical'})],{width:280,height:844,layout:'vertical',fill:'$surface'});

var mobUsers = [{n:'Jo\u00E3o Silva',s:'Ativo'},{n:'Maria Santos',s:'Ativo'},{n:'Pedro Costa',s:'Inativo'},{n:'Ana Oliveira',s:'Ativo'},{n:'Lucas Pereira',s:'Ativo'}].map(function(u) {
  return frame([rect(36,36,'$primary',{cornerRadius:18}),frame([txt(u.n,'$text-primary',14,{fontWeight:'500'}),txt(u.s,u.s==='Ativo'?'$success':'$text-disabled',12)],{layout:'vertical',gap:2}),frame([],{width:'fill_container',height:1}),txt('\u270E','$text-secondary',16),txt('\u2715','$text-secondary',16)],{gap:8,alignItems:'center',width:'fill_container',layout:'horizontal'});
});

doc.children.push(frame([rect(390,844,'$bg'),mobDrawer,frame([frame([frame([txt('\u2630','$text-primary',22),txt('Usuarios','$text-primary',16,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),txt('\uD83C\uDF19','$text-primary',20),txt('\u2699','$text-primary',20)],{padding:[8,12],gap:8,alignItems:'center',width:'fill_container',layout:'horizontal'}),frame([txt('\uD83D\uDD0D  Buscar...','$text-disabled',13)],{padding:[4,12,8,12],width:'fill_container',layout:'horizontal'})],{layout:'vertical',width:'fill_container',fill:'$surface'}),frame([frame([frame([txt('Usuarios','$text-primary',18,{fontWeight:'700'}),frame([],{width:'fill_container',height:1}),txt('+','$primary',20)],{gap:8,alignItems:'center',width:'fill_container',layout:'horizontal'})].concat(mobUsers),{layout:'vertical',padding:12,gap:12,cornerRadius:12,fill:'$surface',width:'fill_container'})],{layout:'vertical',padding:[12,12],gap:12,width:'fill_container'})],{width:'fill_container',height:'fill_container',layout:'vertical'})],{name:'Mobile Layout - Usuarios',width:390,height:844,layout:'horizontal',clip:true,fill:'$bg'}));

// 17. COMPACT RAIL LAYOUT
var railIcons = ['\u2302','\u2B21','\u2699','\uD83D\uDC65','\uD83D\uDD11','\u26A0','\u2665'].map(function(ic) {
  return frame([txt(ic,'$text-secondary',18)],{padding:[14,12],cornerRadius:8,layout:'horizontal',alignItems:'center',justifyContent:'center'});
});

doc.children.push(frame([rect(1440,900,'$bg'),frame([rect(32,32,'$primary',{cornerRadius:16}),rect(32,1,'$divider')].concat(railIcons).concat([rect(32,1,'$divider'),frame([],{width:1,height:'fill_container'}),txt('\u23FB','$text-secondary',18)]),{width:56,height:900,layout:'vertical',fill:'$surface',alignItems:'center',gap:4,padding:[0,8]}),frame([frame([txt('\u2630','$text-primary',22),txt('Boilerplate','$text-primary',18,{fontWeight:'500'}),frame([],{width:'fill_container',height:1}),txt('\uD83C\uDF19','$text-primary',20),txt('\u2699','$text-primary',20)],{padding:[0,24],gap:12,alignItems:'center',width:'fill_container',fill:'$surface',height:64,layout:'horizontal'}),frame([txt('Home','$text-secondary',13),txt('/','$text-disabled',13),txt('User Management','$text-primary',13,{fontWeight:'500'})],{width:'fill_container',padding:[0,4],gap:6,alignItems:'center',layout:'horizontal'}),frame([txt('Usuarios','$text-primary',24,{fontWeight:'700'}),txt('Selecione um usuario para ver detalhes','$text-secondary',14)],{layout:'vertical',padding:12,gap:16,cornerRadius:12,fill:'$surface',width:'fill_container'})],{width:'fill_container',height:900,layout:'vertical',padding:[24,24],gap:16}),frame([txt('User Management','$text-primary',14),txt('\u2318\u21E7U','$text-disabled',12)],{width:190,height:48,layout:'vertical',padding:8,gap:2,cornerRadius:8,fill:'$surface',layoutPosition:'absolute',x:64,y:216})],{name:'Compact Rail Layout',width:1440,height:900,layout:'horizontal',clip:true}));

fs.writeFileSync('boilerplate.pen', JSON.stringify(doc, null, 2), 'utf8');
console.log('OK! ' + doc.children.length + ' children, ' + _cid + ' nodes.');
