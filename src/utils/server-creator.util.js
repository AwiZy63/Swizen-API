const ServerBuilder = require("nodeactyl/src/utils/ServerBuilder");
const { panel, pteropanel } = require("../../config/database.config");

module.exports = createServer = async (serverOffer, serverOwner, serverCpu, serverRam, serverDisk, serverDatabase, serverType) => {

    let server = new ServerBuilder();

    /* Server parameters */
    server.setServerName(`Mon serveur ${serverOffer.toLowerCase()}`);
    server.setServerOwner(serverOwner);
    /* Server limits */
    server.setServerCPU(100 * serverCpu);
    server.setServerRAM(1024 * serverRam);
    server.setServerDatabaseLimit(serverDatabase);
    server.setServerBackupLimit(2);
    server.default.limits.disk = (1024 * serverDisk);
    server.default.description = serverOffer;
    /* Server start */
    server.setServerSkipScripts(false);
    server.setServerStartsWhenCompleted(true);

    const serverObject = server.getServerObject();

    if (serverType === 'Minecraft') {
        server.default.nest = 1;
        server.setServerEgg(5);
    }

    const newServer = panel.createRawServer(serverObject).then(res => {
        const data = res.attributes;
        const currentDate = new Date();
        let expirationDate = currentDate.setMonth(currentDate.getMonth() + 1);
        expirationDate = new Date(expirationDate);
        const formattedExpDate = `${expirationDate.getFullYear()}-${expirationDate.getMonth() + 1}-${expirationDate.getDate()}`

        pteropanel.execute(`UPDATE servers SET exp_date='${formattedExpDate}' WHERE uuidShort='${data.identifier}'`, (error, response) => {
            if (error) throw error;
        })
    });


    if (newServer) {
        return 'SUCCESS';
    }
    return 'ERROR';
};