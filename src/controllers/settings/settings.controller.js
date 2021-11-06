const Setting = require("../../models/settings/setting.model");
const User = require("../../models/users/users.model");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
    try {
        const data = req.body;

        if (!data || !data.flag || !data.value) {
            return res.json({
                error: true,
                message: "Requête invalide, veuillez remplir tous les champs nécessaires."
            }).status(400);
        }

        const settings = await Setting.findOne({ where: { flag: data.flag } });
        console.log(settings)
        if (settings) {
            return res.json({
                error: true,
                message: "Le paramètre existe déjà."
            }).status(400);
        }

        const settingDetails = {
            flag: data.flag,
            value: data.value
        }

        const newSettings = new Setting(settingDetails);
        await newSettings.save();

        return res.json({
            success: true,
            message: "Le nouveau paramètre a été créé."
        }).status(200);
    } catch (error) {
        console.log("setting-create", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.toggleMaintenance = async (req, res) => {
    try {
        const maintenanceMode = await Setting.findOne({ where: { flag: "maintenanceMode" } });

        if (!maintenanceMode) {
            return res.json({
                error: true,
                message: "Le mode maintenance est introuvable sur le serveur."
            }).status(404)
        }

        if (maintenanceMode.value === 'active') {
            await maintenanceMode.update({ value: 'inactive' });
            return res.json({
                success: true,
                message: "Le mode maintenance a été désactivé."
            }).status(200);
        }

        if (maintenanceMode.value === 'inactive') {
            await maintenanceMode.update({ value: 'active' });
            return res.json({
                success: true,
                message: "Le mode maintenance a été activé."
            }).status(200);
        }

        if (maintenanceMode.value !== 'active' || maintenanceMode.value !== 'inactive') {
            await maintenanceMode.update({ value: 'inactive' });
            return res.json({
                success: true,
                message: "Le mode maintenance a été défini sur inactif."
            });
        }
    } catch (error) {
        console.log("maintenance-mode-toogle", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.getMaintenanceStatus = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;

        const maintenanceMode = await Setting.findOne({ where: { flag: 'maintenanceMode' } });
        
        if (!maintenanceMode) {
            return res.json({
                error: true,
                message: "Le mode maintenance est introuvable sur le serveur."
            }).status(404)
        }
        
        if (authorizationHeader || authorizationHeader.split(" ")[1]) {
            const token = req.headers.authorization.split(" ")[1];
            if (token !== undefined) {
                const user = await User.findOne({
                    where: {
                        access_token: token
                }
            });
            if (user && user.permission_level === 2) {
                return res.json({
                    success: true,
                    status: 'inactive'
                }).status(200);
            }
        }
        }

        return res.json({
            success: true,
            status: maintenanceMode.value
        }).status(200);
    } catch (error) {
        console.log("get-maintenance-mode-status", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}