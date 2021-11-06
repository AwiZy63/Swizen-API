const express = require("express");
const router = express.Router();

const AuthController = require("../../controllers/users/users.controller.js");
const { validateToken } = require("../../middlewares/validateToken.js");
const { validateStaff, validateSupport, validateDirector } = require("../../middlewares/validateStaff.js");
// validateStaff = Accès pour tout les staff ( permissionLevel > 0 )
// validateSupport = Accès pour les supports & les directeurs ( permissionLevel = 1 )
// validateDirector = Accès pour les directeurs ( permissionLevel = 2 )

router.post("/signup", AuthController.Signup);
router.patch("/verify", AuthController.Activate);
router.post("/resend", AuthController.ResendVerify);
router.post("/login", AuthController.Login);
router.post("/forgot", AuthController.ForgotPassword);
router.patch("/reset", AuthController.ResetPassword);
router.put("/update", validateToken, AuthController.Update);
router.post("/logout", validateToken, AuthController.Logout);

router.get("/profil", validateToken, AuthController.GetProfil);
router.get("/:id", validateStaff, AuthController.GetById);
router.get("/", validateStaff, AuthController.GetAll);

router.patch("/suspend", validateDirector, AuthController.Suspend);
router.patch("/unsuspend", validateDirector, AuthController.UnSuspend);
router.put("/changepassword", validateToken, AuthController.ChangePassword);

router.patch("/wallet/add", validateToken, AuthController.addWallet);
router.patch("/wallet/sub", validateToken, AuthController.subWallet);
router.put("/wallet/update/:user_id", validateDirector, AuthController.updateWallet);

module.exports = router;