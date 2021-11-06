'use strict';

const { pteropanel, clientPanel } = require("../../../config/database.config");

exports.findAllServersByUserId = async (req, res) => {
    try {
        const { panelId } = req.decoded;

        if (!panelId) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        await pteropanel.execute(`
        SELECT 
            servers.*,
            allocations.ip AS server_ip,
            allocations.port AS server_port,
            nodes.name AS node_name,
            nodes.fqdn AS node_fqdn
        FROM servers
        LEFT JOIN allocations ON servers.allocation_id = allocations.id
        LEFT JOIN nodes ON allocations.node_id = nodes.id
        LEFT JOIN subusers ON (subusers.server_id = servers.id) WHERE subusers.user_id=${panelId} OR servers.owner_id=${panelId}
        GROUP BY created_at;
        `, (error, response) => {
            if (error) {
                console.log(error)
                return res.json({
                    error: true,
                    message: "Impossible de récupérer les serveurs."
                });
            }

            return res.json({
                success: true,
                servers: response
            });
        })
    } catch (error) {
        console.log(error);
        return res.json({
            error: true,
            message: "Récupération des serveurs impossible."
        })
    }
}

exports.serverPowerActions = async (req, res) => {
    try {
        const { panelId } = req.decoded;
        const serverId = req.body.serverId;
        const actionType = req.body.actionType;

        if (!panelId || !serverId || !actionType) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const serverStatus = await clientPanel.getServerStatus(serverId);

        await pteropanel.execute(`
        SELECT servers.id FROM servers LEFT JOIN subusers ON (subusers.server_id = servers.id) WHERE (subusers.user_id=${panelId} AND servers.uuidShort='${serverId}') OR (servers.owner_id=${panelId} AND servers.uuidShort='${serverId}') GROUP BY id;
        `, async (error, response) => {
            if (error) {
                console.log(error)
                return res.json({
                    error: true,
                    message: "Accès interdit."
                });
            }

            if (response.length <= 0) {
                return res.json({
                    error: true,
                    message: "Accès interdit."
                })
            }

            if (actionType === 'start') {
                if (serverStatus !== 'offline') {
                    if (serverStatus === 'running') {
                        return res.json({
                            error: true,
                            message: "Le serveur est déjà en ligne."
                        });
                    }
                    if (serverStatus === 'starting') {
                        return res.json({
                            error: true,
                            message: "Le serveur est en cours de démarrage."
                        });
                    }
                }

                await clientPanel.startServer(serverId);
                return res.json({
                    success: true,
                    message: "Le serveur est en cours de démarrage."
                });
            } else if (actionType === 'restart') {
                await clientPanel.restartServer(serverId);
                return res.json({
                    success: true,
                    message: "Le serveur est en cours de redémarrage."
                });
            } else if (actionType === 'stop') {
                if (serverStatus === 'offline') {
                    return res.json({
                        error: true,
                        message: "Le serveur est déjà hors ligne."
                    })
                }
                await clientPanel.stopServer(serverId);
                return res.json({
                    success: true,
                    message: "Le serveur s'éteint."
                });
            } else {
                return res.json({
                    error: true,
                    message: "Requête invalide, veuillez selectionner une action entre start, restart et stop."
                })
            }
        })
    } catch (error) {
        console.log("Server Power :", error);
        return res.json({
            error: true,
            message: "Une erreur est survenue, veuillez réessayer plus tard."
        })
    }
}

exports.findServerById = async (serverId) => {
    try {
        await pteropanel.execute(`
        SELECT 
            servers.*
        FROM servers WHERE uuidShort='${serverId}';
        `, (error, response) => {
            if (error) {
                console.log("FindAllByIdServers :", error)
            }
            console.log(response)
            return response[0];
        });
    } catch (error) {
        console.log("FindAllByIdServers :", error);
    }
}
/*
(async () => {
    const serverId = "3af094b9"
    console.log(await pteropanel.execute(`SELECT servers.* FROM servers WHERE uuidShort='${serverId}';`, (err, response) => {
        console.log();
    }))
})()*/