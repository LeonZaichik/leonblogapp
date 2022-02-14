import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "leva.zaichik@gmail.com",
    subject: "Welcome to Leon Blog",
    text: `Welcome to Leon Blog, ${name}. Enjoy!`,
  });
};

export default sendWelcomeEmail;
