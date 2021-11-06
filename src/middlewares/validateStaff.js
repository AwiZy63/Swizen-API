const jwt = require("jsonwebtoken");
const config = require("../../config/api_config.json");
const User = require("../models/users/users.model");

async function validateSupport(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
        return res.json({
            error: true,
            message: "Le token d'accès est manquant."
        }).status(401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const options = {
        expiresIn: "24h",
    };
    try {
        let user = await User.findOne({
            where: {
                access_token: token
            }
        });
        if (!user) {
            return res.json({
                error: true,
                message: "Accès interdit."
            }).status(403);
        }
        result = jwt.verify(token, config.JWT_SECRET, options);
        if (!user.id === result.id) {
            return res.json({
                error: true,
                message: "Token invalide."
            }).status(401);
        }
        req.decoded = result;
        
        if (result.permission >= 1) {
            next();
        } else {
            return res.json({
                error: true,
                message: "Accès interdit."
            }).status(403);
        }
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            result = {
                error: true,
                message: "TokenExpired"
            };
        } else {
            result = {
                error: true,
                message: "Erreur d'authentification."
            };
        }
        return res.json(result).status(403);
    }
}

async function validateDirector(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    let result;
    
    if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
        return res.json({
            error: true,
            message: "Le token d'accès est manquant."
        }).status(401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const options = {
        expiresIn: "24h",
    };
    try {
        let user = await User.findOne({
            where: {
                access_token: token
            }
        });
        if (!user) {
            return res.json({
                error: true,
                message: "Accès interdit."
            }).status(403);
        }
        result = jwt.verify(token, config.JWT_SECRET, options);
        if (!user.id === result.id) {
            return res.json({
                error: true,
                message: "Token invalide."
            }).status(401);
        }
        req.decoded = result;

        if (user.permission_level === 2) {
            next();
        } else {
            return res.json({
                error: true,
                message: "Accès interdit."
            }).status(403);
        }
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            result = {
                error: true,
                message: "TokenExpired"
            };
        } else {
            result = {
                error: true,
                message: "Erreur d'authentification."
            };
        }
        return res.json(result).status(403);
    }
}

async function validateStaff(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (!authorizationHeader || !authorizationHeader.split(" ")[1]) {
        return res.json({
            error: true,
            message: "Le token d'accès est manquant."
        }).status(401);
    }
    const token = req.headers.authorization.split(" ")[1];
    const options = {
        expiresIn: "24h",
    };
    try {
        let user = await User.findOne({
            where: {
                access_token: token
            }
        });
        if (!user) {
            return res.json({
                error: true,
                message: "Accès interdit."
            }).status(403);
        }
        result = jwt.verify(token, config.JWT_SECRET, options);
        if (!user.id === result.id) {
            return res.json({
                error: true,
                message: "Token invalide."
            }).status(401);
        }
        req.decoded = result;

        if (user.permission_level > 0) {
            next();
        } else {
            return res.json({
                error: true,
                message: "Accès interdit."
            }).status(403);
        }
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            result = {
                error: true,
                message: "TokenExpired"
            };
        } else {
            result = {
                error: true,
                message: "Erreur d'authentification."
            };
        }
        return res.json(result).status(403);
    }
}

module.exports = { validateSupport, validateDirector, validateStaff};