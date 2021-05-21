/*************************************************************************
 * 
 * 
           _           _ _             _____       _      _     
     /\   | |         | (_)           / ____|     | |    | |    
    /  \  | | __ _  __| |_ _ __ _____| (___   __ _| | ___| |__  
   / /\ \ | |/ _` |/ _` | | '_ \______\___ \ / _` | |/ _ \ '_ \ 
  / ____ \| | (_| | (_| | | | | |     ____) | (_| | |  __/ | | |
 /_/    \_\_|\__,_|\__,_|_|_| |_|    |_____/ \__,_|_|\___|_| |_|
                                                                
                                                                
 * Serveur proxy créer via nodeJS pour contourner les erreurs CORS.
 * Ce serveur ne possède pas de certificat auto-signé.
 * HTTP
 * Créer le 20/05/21 par @Aladin-Saleh
 * Libre d'utilisation
 * Github :  https://github.com/Aladin-Saleh
 * npm --save install morgan
 * npm --save install express
 * 
************************************************************************/


const express = require('express');
const morgan = require("morgan");//HTTP request logger (enregistre toutes les requetes recus)
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');


//Middleware = reséau d'echange d'information entre differentes application
//Ici, reseau d'echange entre serveur

//CONSTANTE
const PORT = 3000;
const HOST = "localhost";
const SERVICE_URL = ""

//On enregistre les requetes entrantes via le middleware morgan
app.use(morgan('combined'));

app.get('/info', (req, res, next) => {
    res.setHeader('Content-type','application/xml');
    res.send('This is a proxy service.');
    //console.log(res);
 });


 app.all('*', (req, res, next) => {
    let origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

 // Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
    target: SERVICE_URL,
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
 }));

 app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
