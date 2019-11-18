var express = require('express')
var path = require('path')
var app = express()
var fs = require('fs')

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.redirect('search')
})

app.get('/search', function (req, res) {
  res.render('search')
})


app.get('/source', function (req, res, next) {

  var filePath = path.resolve('./public/source');
  //调用文件遍历方法
  var pics = []
  fileDisplay(filePath);
  console.log(pics)
  //文件遍历方法
  function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    var files = fs.readdirSync(filePath)

    for (var i = 0; i < files.length; i++) {
      let filename = files[i]
      if (filename.indexOf('.') === 0) {
        continue
      }
      var filedir = path.join(filePath, filename);

      var stats = fs.statSync(filedir)

      var isFile = stats.isFile();//是文件
      var isDir = stats.isDirectory();//是文件夹
      if(isFile){
        let staticPath = path.resolve(__dirname, './public')
        var relativePath = path.relative(staticPath, filedir);
        pics.push({
          src: relativePath,
          name: filename.split('.')[0]
        })
      }
      if(isDir){
        fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    }

  }

  res.json({data: pics, code: 200, message: 'success'})
})

app.listen(3000)