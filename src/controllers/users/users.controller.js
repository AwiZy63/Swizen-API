const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../../users/helpers/mailer');
const { generateJwt } = require("../../users/helpers/generateJwt")
const User = require("../../models/users/users.model");
const { Op } = require("sequelize");
const { phone } = require("phone");
const validator = require("validator");
const { panel } = require("../../../config/database.config");
const { userSheet } = require("../../utils/sheetsController.util");
const randomToken = require('random-token').create('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

const userSchema = Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(4),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    phone: Joi.string(),
    country: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    postal_code: Joi.number(),
    additional_address: Joi.string(),
});

exports.Signup = async (req, res) => {
    try {
        const result = userSchema.validate(req.body);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message,
            }).status(400);
        }
        const user = await User.findOne({ where: { email: result.value.email } });

        if (user) {
            return res.json({
                error: true,
                message: "L'email est déjà utilisée.",
            }).status(400);
        }
        if (result.value.phone) {
            const phoneFormat = await phone(result.value.phone, { country: 'FR' });
            if (phoneFormat.isValid) {
                const phoneExist = await User.findOne({ where: { phone: phoneFormat.phoneNumber } });
                if (phoneExist) {
                    return res.json({
                        error: true,
                        message: "Le numéro de téléphone est déjà utilisé."
                    }).status(400);
                }
            } else {
                return res.json({
                    error: true,
                    message: "Le numéro de téléphone est invalide."
                }).status(400);
            }
        }

        const hash = await User.hashPassword(result.value.password);

        delete result.value.confirmPassword;
        result.value.password = hash;

        /* Vérification de l'email */
        const code = Math.floor(100000 + Math.random() * 900000); // Génère un code à 6 chiffres.
        const expiry = Date.now() + 60 * 1000 * 15; // Le code expire dans 15 minutes.
        const sendCode = await sendEmail(result.value.email, code, "Vérifiez votre email", "verifyEmail");

        if (sendCode.error) {
            return res.json({
                error: true,
                message: "Impossible d'envoyer une vérification d'email."
            }).status(500);
        }

        result.value.email_token = code;
        result.value.email_token_expires = expiry;

        /* */
        // Sauvegarde de l'utilisateur dans la bdd
        const newUser = new User(result.value);
        await newUser.save();
        return res.json({
            success: true,
            message: 'Enregistrement effectué'
        }).status(200);
    } catch (err) {
        console.error("signup-error : " + err);
        return res.json({
            error: true,
            message: "Enregistrement impossible."
        }).status(500);
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                error: true,
                message: "Authentification impossible."
            }).status(403);
        }

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.json({
                error: true,
                message: "Identifiants invalides"
            }).status(400);
        }

        if (user) {
            if (user.suspended === 1) {
                return res.json({
                    error: true,
                    message: "Le compte a été suspendu."
                }).status(403);
            }
        }

        const isValid = await User.comparePasswords(password, user.password);
        if (!isValid) {
            return res.json({
                error: true,
                message: "Identifiants invalides"
            }).status(403);
        }

        if (!user.active) {
            return res.json({
                error: true,
                message: "Vous devez vérifier votre email pour activer votre compte."
            }).status(400);
        }
        /* Genération du token d'accès */
        const { error, token } = await generateJwt(
            user.id,
            user.panel_id,
            user.email,
            user.permission_level,
            user.first_name,
            user.last_name,
            user.phone,
            user.country,
            user.address,
            user.city,
            user.postal_code,
            user.additional_address
        );
        if (error) {
            return res.json({
                error: true,
                message: "Impossible de créer le token, veuillez réessayer plus tard."
            }).status(500);
        }
        const access_token_expires = new Date().getTime() + (((60 * 1000) * 60) * 24);
        user.access_token = token;
        user.access_token_expires = access_token_expires;

        await user.save();

        // Success
        return res.send({
            success: true,
            message: "Vous êtes désormais connecté.",
            access_token: token,
            access_token_expires: access_token_expires
        }).status(200);
    } catch (err) {
        console.error("Login error : " + err);
        return res.json({
            error: true,
            message: "Connection impossible. Veuillez réessayer plus tard."
        }).status(500);
    }
}

exports.Activate = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.json({
                error: true,
                message: "Requête invalide."
            }).status(400);
        }
        const user = await User.findOne({
            where: {
                email: email,
                email_token: code,
                email_token_expires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.json({
                error: true,
                message: "L'adresse email ou le code est invalide ou a expiré."
            }).status(400);
        } else {

            if (user.suspended === 1) {
                return res.json({
                    error: true,
                    message: "Le compte a été suspendu."
                }).status(403);
            }

            if (user.active) {
                return res.send({
                    error: true,
                    message: "Le compte est déjà actif.",
                }).status(400);
            }

            const createPanelUser = await panel.createUser(
                user.email,
                //user.email.slice("@", user.email.indexOf("@")),
                `SWIZEN-${randomToken(6)}`,
                user.first_name.toLowerCase(),
                user.last_name.toLowerCase()
            ).then(response => response.attributes.id).catch(async (err) => {
                if (err) {
                    let userData = false;
                    await panel.getAllUsers().then(res => userData = res.data.find(d => d.attributes.email === user.email)).catch(err => console.error(err));
                    return userData.attributes.id
                }
            }).catch(err => console.error("Panel account creation error : ", err));

            user.panel_id = createPanelUser;
            user.email_token = "";
            user.email_token_expires = null;
            user.active = true;
            await user.save();

            userSheet(user, 'POST');
            return res.json({
                success: true,
                message: "Votre compte est désormais actif."
            }).status(200);
        }
    } catch (err) {
        console.error("activation-error : " + err);
        return res.json({
            error: true,
            message: err.message
        }).status(500);
    }
};

exports.ResendVerify = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.send({
                error: true,
                message: "Veuillez renseigner un email valide."
            }).status(400);
        }
        if (!email) {
            return res.send({
                error: true,
                message: "Veuillez renseigner un email."
            }).status(400);
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.send({
                success: true,
                message: "Si cette adresse email est dans notre base de données, et que le compte n'est pas encore actif, vous recevrez un code pour vérifier votre adresse email."
            }).status(200);
        }
        if (user && user.active === 1) {
            return res.send({
                success: true,
                message: "Si cette adresse email est dans notre base de données, et que le compte n'est pas encore actif, vous recevrez un code pour vérifier votre adresse email."
            }).status(200);
        }

        let code = Math.floor(100000 + Math.random() * 900000);
        let response = await sendEmail(user.email, code, "Vérifiez votre email", "verifyEmail");

        if (response.error) {
            return res.json({
                error: true,
                message: "Impossible d'envoyer le mail. Veuillez réessayer plus tard."
            }).status(500);
        }
        let expiry = Date.now() + 60 * 1000 * 15;
        user.email_token = code;
        user.email_token_expires = expiry;
        await user.save();
        return res.send({
            success: true,
            message: "Si cette adresse email est dans notre base de données, et que le compte n'est pas encore actif, vous recevrez un code pour vérifier votre adresse email."
        }).status(200);
    } catch (err) {
        console.error("resend-verify-error : " + err);
        return res.json({
            error: true,
            message: error.message,
        }).status(500);
    }
};

exports.ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!validator.isEmail(email)) {
            return res.send({
                error: true,
                message: "Veuillez renseigner un email valide."
            }).status(400);
        }
        if (!email) {
            return res.send({
                error: true,
                message: "Veuillez renseigner un email."
            }).status(400);
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.send({
                success: true,
                message: "Si cette adresse email est dans notre base de données, vous recevrez un code pour réinitialiser votre mot de passe."
            }).status(200);
        }

        if (user.active === 0)
            return res.send({
                error: true,
                message: "Votre compte doit être actif.",
            }).status(403);

        let code = Math.floor(100000 + Math.random() * 900000);
        let response = await sendEmail(user.email, code, "Changez votre mot de passe", "forgotPassword");

        if (response.error) {
            return res.json({
                error: true,
                message: "Impossible d'envoyer le mail. Veuillez réessayer plus tard."
            }).status(500);
        }
        let expiry = Date.now() + 60 * 1000 * 15;
        user.reset_password_token = code;
        user.reset_password_expires = expiry;
        await user.save();
        return res.send({
            success: true,
            message: "Si cette adresse email est dans notre base de données, vous recevrez un code pour réinitialiser votre mot de passe."
        }).status(200);
    } catch (err) {
        console.error("forgot-password-error : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
}

exports.ResetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (!token || !password || !confirmPassword) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(403);
        }
        const user = await User.findOne({
            where: {
                reset_password_token: req.body.token,
                reset_password_expires: { [Op.gt]: Date.now() }
            }
        });
        if (!user) {
            return res.send({
                error: true,
                message: "Le token est invalide ou a expiré."
            }).status(400);
        }

        if (user) {
            if (user.suspended === 1) {
                return res.json({
                    error: true,
                    message: "Le compte a été suspendu."
                }).status(403);
            }
        }

        if (password !== confirmPassword) {
            return res.json({
                error: true,
                message: "Les mots de passe ne correspondent pas."
            }).status(400);
        }
        const hash = await User.hashPassword(req.body.password);
        user.password = hash;
        user.reset_password_token = "";
        user.reset_password_expires = null;
        await user.save();
        return res.send({
            success: true,
            message: "Votre mot de passe a bien été modifié."
        }).status(200);
    } catch (err) {
        console.error("reset-password-error : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
};

exports.ChangePassword = async (req, res) => {
    try {
        const { userId } = req.decoded;

        if (!req.body || !req.body.currentPassword || !req.body.newPassword || !req.body.confirmNewPassword) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        if (req.body.newPassword !== req.body.confirmNewPassword) {
            return res.json({
                error: true,
                message: "Les deux mots de passe ne correspondent pas."
            }).status(400);
        }
        let password = req.body.currentPassword;

        const user = await User.findOne({ where: { id: userId } });
        const isValid = await User.comparePasswords(password, user.password);

        if (!isValid) {
            return res.json({
                error: true,
                message: "Le mot de passe actuel est incorrect."
            }).status(400);
        }

        const newPassword = await User.hashPassword(req.body.confirmNewPassword);
        await user.update({ password: newPassword });
        return res.json({
            success: true,
            message: "Votre mot de passe a été mis à jour."
        }).status(200);

    } catch (err) {
        console.error("change-password : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
}

exports.Logout = async (req, res) => {
    try {
        const { userId } = req.decoded;
        let user = await User.findOne({
            where: {
                id: userId
            }
        });
        user.access_token = "";
        await user.save();
        return res.json({
            success: true,
            message: "Utilisateur déconnecté"
        }).status(200);
    } catch (err) {
        console.error("user-logout-error : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
}

exports.Update = async (req, res) => {
    try {
        const { userId } = req.decoded;
        let user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.json({
                error: true,
                message: "Une erreur est survenue, veuillez rafraichir la page."
            }).status(400);
        }

        const data = {
            first_name: req.body.first_name ? req.body.first_name : user.first_name,
            last_name: req.body.last_name ? req.body.last_name : user.last_name,
            phone: user.phone,
            country: req.body.country ? req.body.country : user.country,
            address: req.body.address ? req.body.address : user.address,
            city: req.body.city ? req.body.city : user.city,
            postal_code: req.body.postal_code ? req.body.postal_code : user.postal_code,
            additional_address: req.body.additional_address ? req.body.additional_address : user.additional_address
        };

        if (req.body.phone) {
            const phoneFormat = await phone(req.body.phone, { country: 'FR' });
            if (phoneFormat.isValid) {
                const phoneExist = await User.findOne({ where: { phone: phoneFormat.phoneNumber } });
                if (phoneFormat.phoneNumber !== user.phone && phoneExist) {
                    return res.json({
                        error: true,
                        message: "Le numéro de téléphone est déjà utilisé."
                    }).status(400);
                }
            } else {
                return res.json({
                    error: true,
                    message: "Le numéro de téléphone est invalide."
                }).status(400);
            }
            data.phone = phoneFormat.phoneNumber
        }

        if (req.body.postal_code && !validator.isPostalCode(data.postal_code, "FR")) {
            return res.json({
                error: true,
                message: "Le code postal est invalide."
            }).status(400);
        }

        await user.update(data).then(res => {
            userSheet(res.dataValues, 'PATCH');
        });
        return res.json({
            success: true,
            message: 'Mise à jour effectuée'
        }).status(200);

    } catch (err) {
        console.error("user-update-error : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
}

exports.GetById = async (req, res) => {
    try {
        const id = req.params.id;
        const { permission } = req.decoded;

        if (!id) {
            return res.json({
                error: true,
                message: "Veuillez renseigner un id."
            }).status(400);
        }
        let user = await User.findOne({ where: { id: id } });

        if (!user) {
            return res.json({
                error: true,
                message: "L'utilisateur est introuvable."
            }).status(404);
        }

        if (user.permissionLevel > permission) {
            return res.json({
                error: true,
                message: "Action interdite."
            }).status(401);
        }

        return res.send({ success: true, data: user });
    } catch (err) {
        console.error("user-getById-error : " + err);
        return res.json({
            error: true,
            message: error.message,
        }).status(500);
    }
}

exports.GetAll = async (req, res) => {
    try {
        let user = await User.findAll();

        if (!user) {
            return res.json({
                error: true,
                message: "Une erreur est survenue, veuillez réessayer plus tard."
            }).status(500);
        }

        return res.send({ success: true, data: user });
    } catch (err) {
        console.error("user-getByEmail-error : " + err);
        return res.json({
            error: true,
            message: error.message,
        }).status(500);
    }
}

exports.GetProfil = async (req, res) => {
    try {
        const { userId } = req.decoded;

        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.json({
                error: true,
                message: "L'utilisateur est introuvable."
            }).status(404);
        }

        return res.json({ success: true, data: user });
    } catch (err) {
        console.error("user-getById-error : " + err);
        return res.json({
            error: true,
            message: error.message,
        }).status(500);
    }
}

exports.Suspend = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.send({
                error: true,
                message: "Veuillez renseigner un email valide."
            }).status(400);
        }

        if (!email) {
            return res.json({
                error: true,
                message: "Requête invalide."
            }).status(400);
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.json({
                error: true,
                message: "Details invalides."
            }).status(400);
        } else {
            if (user.suspended === 1) {
                return res.send({
                    error: true,
                    message: "Le compte est déjà suspendu.",
                }).status(200);
            }

            await user.update({ suspended: 1, access_token: "" }).then(res => {
                userSheet(res.dataValues, 'PATCH');
            });
            return res.json({
                success: true,
                message: "Le compte est désormais suspendu."
            }).status(200);
        }
    } catch (err) {
        console.error("suspend-error : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
};

exports.UnSuspend = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.send({
                error: true,
                message: "Veuillez renseigner un email valide."
            }).status(400);
        }

        if (!email) {
            return res.json({
                error: true,
                message: "Requête invalide."
            }).status(400);
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.json({
                error: true,
                message: "Details invalides."
            }).status(400);
        } else {
            if (user.suspended === 0) {
                return res.send({
                    error: true,
                    message: "Le compte n'est pas suspendu.",
                }).status(200);
            }

            await user.update({ suspended: 0 }).then(res => {
                userSheet(res.dataValues, 'PATCH');
            });
            return res.status(200).json({
                success: true,
                message: "Le compte n'est désormais plus suspendu."
            }).status(200);
        }
    } catch (err) {
        console.error("unsuspend-error : " + err);
        return res.json({
            error: true,
            message: error.message
        }).status(500);
    }
};

/* User wallet */

exports.addWallet = async (req, res) => {
    try {
        const { userId } = req.decoded;
        const data = req.body;
        data.user_id = userId;

        if (!data || !Number(data.amount)) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const user = await User.findOne({ where: { id: data.user_id } });

        if (!user) {
            return res.json({
                error: true,
                message: "Votre compte est introuvable."
            }).status(400);
        }

        user.update({ wallet: user.wallet + parseFloat(data.amount) })
        res.json({
            success: true,
            message: `Votre compte à été crédité de ${data.amount}€`
        }).status(200);
    } catch (error) {
        console.log("wallet-add-error", error);
        return res.json({
            error: true,
            message: error
        });
    }
}

exports.subWallet = async (req, res) => {
    try {
        const { userId } = req.decoded;
        const data = req.body;
        data.user_id = userId;

        if (!data || !Number(data.amount)) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const user = await User.findOne({ where: { id: data.user_id } })

        if (!user) {
            return res.json({
                error: true,
                message: "Votre compte est introuvable."
            }).status(400);
        }

        if ((user.wallet - data.amount) < 0) {
            return res.json({
                error: true,
                message: "Vous n'avez pas assez de crédit sur votre compte. Veuillez recharger votre solde pour continuer."
            });
        }

        user.update({ wallet: user.wallet - data.amount });
        res.json({
            success: true,
            message: "Paiement effectué avec succès."
        }).status(200);
    } catch (error) {
        console.log("wallet-sub-error", error);
        return res.json({
            error: true,
            message: error
        });
    }
}

exports.updateWallet = async (req, res) => {
    try {
        const data = req.body;
        const user_id = req.params.user_id;

        if (!data || !data.amount || !user_id) {
            console.log(data, user_id)
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const user = await User.findOne({ where: { id: user_id } });

        if (!user) {
            return res.json({
                error: true,
                message: "L'utilisateur est introuvable"
            });
        }

        if (data.amount < 0) {
            return res.json({
                error: true,
                message: "Le solde ne peut pas être inferieur à 0."
            });
        }

        user.update({ wallet: data.amount });
        res.json({
            success: true,
            message: `Le solde de l'utilisateur ${user.email} à été défini à ${data.amount}€.`
        }).status(200);
    } catch (error) {
        console.log("wallet-update-error", error);
        return res.json({
            error: true,
            message: error
        });
    }
}