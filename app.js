
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , gm = require('gm')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/images' }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var file;

app.get('/', routes.index);
app.post('/upload', function(req,res){
  file = req.files.file.path;
  res.json({
    file : req.files.file.path.replace("public", "")
  });
});
app.get('/filter/:filtername', function(req, res){
  var filter = req.params.filtername;
  var filters = {
    jayz:function(){
      gm(file)
      .blur(.05)
      .swirl(30)
      .colorize(10,10,1)
      .edge(7)
      .stream()
      .pipe(res)
    },
    gamma:function(){
      gm(file)
      .blackThreshold(100 ,20 ,50)
      .stream()
      .pipe(res)
    },
    blueivy:function(){
      gm(file)
      .colors(30)
      .border(50, 50)
      .emboss(.22)
      .stream()
      .pipe(res)
    },
    contrast:function(){
      gm(file)
      .monochrome()
      .stream()
      .pipe(res)
    },
    mirror:function(){
      gm(file)
      .flop()
      .stream()
      .pipe(res)
    }
  };
  if(typeof filters[filter] == 'undefined'){
    return res.json({error:"invalid filter"});
  }
  filters[filter]();
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


