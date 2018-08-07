const fs = require('fs')
const http = require('http')
const path = require('path')
const mime = require('mime')

// 记录网站根目录
let rootPath = path.join(__dirname, 'www');

// 创建服务器
let server = http.createServer((request, response) => {
    // 生成地址
    let targetPath = path.join(rootPath, request.url)
    // 先判断这个路径下有没有文件
    if (fs.existsSync(targetPath)) {
        // 存在，在判断是文件还是文件夹
        fs.stat(targetPath, (err, stats) => {
            // 判断是文件还是文件夹
        if (stats.isFile()) {
            response.setHeader('content-type', mime.getType(targetPath));
            // 读取文件并返回
            fs.readFile(targetPath, (err, data) => {
                response.end(data)
            })
        }

        // 如果是文件夹
        if (stats.isDirectory()) {
            // 读取文件夹信息
            fs.readdir(targetPath, (err, files) => {
                let tem = ''
                for (let i = 0; i < files.length; i++) {
                    tem += `
                        <li>
                            <a href="${request.url}${request.url == '/'?'':'/'}${files[i]}">
                                ${files[i]}
                            </a>
                        </li>
                        `
                }
                response.end(`
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Document</title>
                    </head>
                    <body>
                        <h1>index of${request.url}</h1>
                        <ul>  
                            ${tem}
                        </ul>
                    </body>
                    </html>
                `)
            })
        }

        })
    } else {
        // 不存在，404
        response.statusCode = 404;
        response.setHeader('content-type', "text/html;charset=utf-8");
        response.end(`
            <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
                <h1>Not Found</h1>
                <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
            </body></html>
        `)
    }
})
// 监听
server.listen(3000, '127.0.0.1', () => {
    console.log('监听成功')

})
