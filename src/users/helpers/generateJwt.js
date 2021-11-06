const jwt = require("jsonwebtoken");
const config = require("./../../../config/api_config.json");
const options = {
    expiresIn: "24h"
};

async function generateJwt(id, panelId, email, permissionLevel, firstName, lastName, phone, country, address, city, postalCode, additionalAddress) {
    try {
        const payload = {
            userId: id,
            panelId: panelId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            country: country,
            address: address,
            city: city,
            postalCode: postalCode, 
            additionalAddress: additionalAddress,
            permission: permissionLevel,
        };
        const token = await jwt.sign(payload, config.JWT_SECRET, options);
        return { error: false, token: token };
    } catch (error) {
        return { error: true };
    }
}

module.exports = { generateJwt };