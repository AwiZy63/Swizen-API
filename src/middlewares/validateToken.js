const jwt = require("jsonwebtoken");
const config = require("../../config/api_config.json");
const User = require("../models/users/users.model");

async function validateToken(req, res, next) {
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
            return res.status(403).json({
                error: true,
                message: "Accès interdit."
            });
        }
        result = jwt.verify(token, config.JWT_SECRET, options);
        if (!user.id === result.id) {
            return res.status(401).json({
                error: true,
                message: "Token invalide."
            });
        }
        req.decoded = result;

        next();
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
        return res.status(403).json(result);
    }
}
module.exports = { validateToken };