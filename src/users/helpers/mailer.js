const nodemailer = require("nodemailer");
const config = require("../../../config/api_config.json");
const verifyEmail_html = require("./templates/verifyEmail.template.js");
const forgotPassword_html = require("./templates/forgotPassword.template.js");
const orderDetails_html = require("./templates/orderDetails.template");

async function sendEmail(email, code, message, type, other) {
  try {
    const smtpEndpoint = config.email.smtp.endpoint;
    const port = config.email.smtp.port;
    const senderAddress = config.email.senderAddress;
    const toAddress = email;
    const smtpUsername = config.email.smtp.username;
    const smtpPassword = config.email.smtp.password;
    const subject = message;

    const base_html = `<!DOCTYPE> 
        <html>
          <body>
            <p>Votre code est : </p> <b>${code}</b>
          </body>
        </html>`
    /*
            const verifyEmail_html = `<!DOCTYPE> 
            <html>
              <body>
                <p>Votre code de vérification est : </p> <b>${code}</b>
              </body>
            </html>`
    */
    /*
            const forgotPassword_html = `<!DOCTYPE> 
            <html>
              <body>
                <p>Votre code de récuperation est : </p> <b>${code}</b>
                <p>Si vous êtes à l'origine de cette demande, vous pouvez ignorer ce mail,
                dans le cas contraire, pensez à sécuriser votre compte.</p>
              </body>
            </html>`
    */
    // Création du transport SMTP
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: config.email.smtp.ssl ? true : false,
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    let mailOptions = {
      from: senderAddress,
      to: toAddress,
      subject: subject,
      html: type === "forgotPassword" ?
        forgotPassword_html(email, code) :
        type === "verifyEmail" ?
          verifyEmail_html(email, code) :
          type === "orderDetails" ?
            orderDetails_html(other) :
            base_html
    };
    let info = await transporter.sendMail(mailOptions);

    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Impossible d'envoyer le mail"
    };
  };
}

module.exports = { sendEmail };