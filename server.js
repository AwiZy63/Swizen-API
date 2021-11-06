console.clear();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const config = require("./config/api_config.json");
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const https = require('https');
const session = require('cookie-session');
require('events').EventEmitter.defaultMaxListeners = Infinity;

const certDir = "/etc/letsencrypt/live/api.swizen.eu"
const privateKey = fs.readFileSync(`${certDir}/privkey.key`);
const certificate = fs.readFileSync(`${certDir}/cert.crt`);

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000
});

const { siteDbConn, pteropanel } = require("./config/database.config")
const app = express();
const socket = require('./src/socket/socket');

process.env.TZ = config.timezone;

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
    res.writeHead(301,
        { Location: 'https://swizen.online' }
    );
    res.end();
});

const productsRoutes = require("./src/routes/products/products.routes");
const productsTypesRoutes = require("./src/routes/products/productsTypes.routes");
const nodesRoutes = require("./src/routes/nodes/nodes.routes");
const usersRoutes = require("./src/routes/users/users.routes");
const supportCategoriesRoutes = require("./src/routes/support/supportCategories.routes");
const supportTicketsRoutes = require("./src/routes/support/supportTickets.routes");
const supportMessagesRoutes = require("./src/routes/support/supportMessages.routes");
const pterodactylRoutes = require("./src/routes/pterodactyl/pterodactyl.routes");
const servicesRoutes = require("./src/routes/services/services.routes");
const invoicesRoutes = require("./src/routes/invoices/invoices.routes");
const settingsRoutes = require("./src/routes/settings/settings.routes");

/* Routes products & products types */
app.use('/api/v1/products/types', apiLimiter, productsTypesRoutes);
app.use('/api/v1/products', apiLimiter, productsRoutes);
/* Routes nodes */
app.use('/api/v1/nodes', apiLimiter, nodesRoutes);
/* Routes users*/
app.use('/api/v1/users', apiLimiter, usersRoutes);
/* Routes support categories*/
app.use('/api/v1/support/categories', apiLimiter, supportCategoriesRoutes);
/* Routes support ticket */
app.use('/api/v1/support/tickets', apiLimiter, supportTicketsRoutes)
/* Routes support messages */
app.use('/api/v1/support/messages', apiLimiter, supportMessagesRoutes)
/* Routes pterodactyl */
app.use('/api/v1/panel', apiLimiter, pterodactylRoutes);
/* Routes services */
app.use('/api/v1/services', apiLimiter, servicesRoutes);
/* Routes invoices */
app.use('/api/v1/invoices', apiLimiter, invoicesRoutes);
/* Routes settings */
app.use('/api/v1/settings', apiLimiter, settingsRoutes);

/* Check pterodactyl nodes status */
const nodesController = require("./src/controllers/nodes/nodes.controller");
setInterval(async () => {
    const nodes = await nodesController.getNodes();
    let list = [];

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        list.push({ "name": node.name, "subdomain": node.subdomain });
    }
    if (list.length > 0) {
        nodesController.updateStatus(list);
    }
}, 5000);

const apiServer = https.createServer({
    key: fs.readFileSync(`${certDir}/privkey.pem`),
    cert: fs.readFileSync(`${certDir}/cert.pem`),
    passphrase: 'api_rT83v9eEU7nKAWgjJzJ3Hfg2X6a5CNch'
}, app).listen(config.apiPort, async () => {
    siteDbConn();
    pteropanel.connect((err) => {
        if (err) throw err;
        console.log("La connection à la base de données du panel à été effectuée.")
    })
    console.log(`L'api a démarré sur le port ${config.apiPort}.`);
});

/* Socket */
const socketServer = https.createServer({
    key: fs.readFileSync(`${certDir}/privkey.pem`),
    cert: fs.readFileSync(`${certDir}/cert.pem`),
    passphrase: 'SOCKET_rT83v9eEU7nKAWgjJzJ3Hfg2X6a5CNch'
}, app).listen(config.socketPort, async () => {
    console.log(`Le socket a démarré sur le port ${config.socketPort}.`);
});

socket.init(socketServer);