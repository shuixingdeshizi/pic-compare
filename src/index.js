const http = require('http');
const url = require('url')

var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve('./source');




const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {    
  let pathname = url.parse(req.url).pathname;
  let extname = path.extname(pathname);
  if (pathname == '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(path.join(__dirname, pathname, 'index.html')));
  } else if (pathname === '/source') {
    var pics = []
    //调用文件遍历方法
    fileDisplay(filePath);
    console.log(pics)
    //文件遍历方法
    function fileDisplay(filePath){
      //根据文件路径读取文件，返回文件列表
      fs.readdir(filePath,function(err,files){
          if(err){
              console.warn('err')
          }else{
              //遍历读取到的文件列表
              files.forEach(function(filename){
                  //获取当前文件的绝对路径
                  var filedir = path.join(filePath, filename);
                  //根据文件路径获取文件信息，返回一个fs.Stats对象
                  fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                          console.log(filedir);
　　　　　　　　　　　　　　　　　// 读取文件内容
                          // var content = fs.readFileSync(filedir, 'utf-8');
                          // console.log(content);
                          pics.push(filedir)
                          console.log(pics)
                        }
                        if(isDir){
                          fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                  })
              });
          }
      });
    }
  } else if (extname == '.jpg' || extname == '.png') {
      res.writeHead(200, { 'Content-Type': 'image/' + extname.substr(1) });
      res.end(fs.readFileSync(path.join(__dirname, pathname)));
  } else {
      // res.statusCode = 404;
      res.end('404');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});