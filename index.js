let express = require('express');
let app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const settingsBill =require("./settings-bill");
//const settingsBill = require('./settings-biljjl');
const settingsBillApp = settingsBill();

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath:  './views',
  layoutsDir : './views/layouts'
});

app.use(express.static('public'));

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function(req, res){
  res.render('index',{
    settings: settingsBillApp.getSettings(),
    totals: settingsBillApp.totals(),
    color : settingsBillApp.addclassName()
  });
});

app.post('/settings', function(req, res){
    console.log(req.body);
    settingsBillApp.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel

    })

    //console.log(settingsBill.getSettings());

    res.redirect("/");
});

app.post('/actions', function(req, res){

  //console.log(req.body.actionType)
  res.redirect("/");
settingsBillApp.recordAction(req.body.actionType)
});

app.get('/actions', function(req, res){
res.render('actions',{actions: settingsBillApp.actions()});
});




app.get('/actions/:actionType', function(req, res){
  const actionType = req.params.actionType;
  ///res.render('actions',{actions: settingsBillApp.actionsFor(actionType)});
  res.render('actions',{actions: settingsBillApp.actionsFor(actionType)});
});





let PORT = process.env.PORT || 3013;

app.listen(PORT, function(){
  console.log('App started on port:', PORT);
});



