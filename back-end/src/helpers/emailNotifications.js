const nodeMailer = require("nodemailer");

/* Send User Auth */
const sendUserAuth = (email, password) => {
  console.log("request came");
  let transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Welcome",
    text:
      "Félicitations ! Votre compte a été créé.. \nVotre mot de passe : " +
      password +
      " \nBonne réception.  ",
  };
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      return console.log(err);
    } else {
      return console.log("msg sent");
    }
  });
};

module.exports = {
  sendUserAuth,
};
