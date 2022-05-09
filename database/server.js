const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const { insertUsuario, selectUsuarios, updateUsuario, deleteUsuario, nuevaTransferencia, selectTransferencias } = require('./queries');

http.createServer(async (req, res) => {

    if (req.url == '/' && req.method == 'GET') {
 
        fs.readFile(path.join(__dirname, '..', 'index.html'), (error, html) => {

            if (error) {

                res.statusCode = 500;
                res.end(error);

            } else {

                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 201;
                res.end(html);
                
            };

        });

    };

    if (req.url == '/style') {

        fs.readFile(path.join(__dirname, '..', '/assets/css/style.css'), (error, css) => {

            if (error) {

                res.statusCode = 500;
                res.end(error);

            } else {

                res.setHeader('Content-Type', 'text/css');
                res.statusCode = 201;
                res.end(css);

            };
  
        });

    };

    if (req.url == '/script') {
       
        fs.readFile(path.join(__dirname, '..', '/assets/js/script.js'), (error, js) => {

            if (error) {

                res.statusCode = 500;
                res.end(error);

            } else {

                res.setHeader('Content-Type', 'text/javascript');
                res.statusCode = 201;
                res.end(js);

            };
        });

    };

    if (req.url == '/logoBanco') {

        fs.readFile(path.join(__dirname, '..', '/assets/img/baseline_account_balance_white_48dp.png'), (error, img) => {

            if (error) {

                res.statusCode = 500;
                res.end(error);

            } else {

                res.setHeader('Content-Type', 'image/jpeg');
                res.statusCode = 201;
                res.end(img);

            };

        });

    };

    if (req.url == '/fondo') {

        fs.readFile(path.join(__dirname, '..', '/assets/img/mountain-nawpic-5.jpg'), (error, img) => {

            if (error) {

                res.statusCode = 500;
                res.end(error);

            } else {

                res.setHeader('Content-Type', 'image/jpeg');
                res.statusCode = 201;
                res.end(img);

            };

        });

    };

    if (req.url == '/usuario' && req.method == 'POST') {

        let body = '';

        req.on('data', (chunk) => {

            body += chunk;

        });

        req.on('end', async () => {

            try {

                let data = Object.values(JSON.parse(body));
                let respuesta = await insertUsuario(data);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));

            } catch (error) {

                res.statusCode = 500;
                res.end(error);

            }; 

        });

    };

    if (req.url == '/usuarios' && req.method == 'GET') {

        try {

            const registros = await selectUsuarios();
            res.statusCode = 201;
            res.end(JSON.stringify(registros.rows));

        } catch (error) {

            res.statusCode = 500;
            res.end(error);

        };

    };

    if (req.url.startsWith('/usuario') && req.method == 'PUT') {

        let body = '';

        req.on('data', (chunk) => {

            body += chunk;

        });

        req.on('end', async () => {

            try {

                let data = Object.values(JSON.parse(body));
                let respuesta = await updateUsuario(data);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));

            } catch (error) {

                res.statusCode = 500;
                res.end(error);

            };

        });

    };

    if (req.url.startsWith('/usuario') && req.method == 'DELETE') {

        try {

            const { id } = url.parse(req.url, true).query;
            const respuesta = await deleteUsuario(id);
            res.statusCode = 201;
            res.end(JSON.stringify(respuesta));

        } catch (error) {

            res.statusCode = 500;
            res.end(error);

        };

    };

    if (req.url == '/transferencia' && req.method == 'POST') {

        let body = '';

        req.on('data', (chunk) => {

            body += chunk;

        });

        req.on('end', async () => {

            try {

                let datos  = Object.values(JSON.parse(body));
                const respuesta = await nuevaTransferencia(datos);

                if (typeof respuesta == 'string') {

                    const objetoRespuesta = { error: respuesta };
                    res.end(JSON.stringify(objetoRespuesta));

                } else {

                    res.statusCode = 201;
                    res.end(JSON.stringify(respuesta));

                };

            } catch (error) {

                res.statusCode = 500;
                res.end(error);

            };

        });

    };

    if (req.url == '/transferencias' && req.method == 'GET') {

        try {

            const registros = await selectTransferencias();
            res.statusCode = 201;
            res.end(JSON.stringify(registros));

        } catch (error) {

            res.statusCode = 500;
            res.end(error);

        };

    };

}).listen(3000, () => { console.log('Escuchado al servidor 3000'); });