const nodeMailer = require('nodemailer')

const sendmail = async(options) => {
    let transporter = nodeMailer.createTransport({
        service:"gmail",
        auth:{
            user:"mandar.technocommet@gmail.com",
            pass:"vddiewtxdwtxyzup"
        }
      })

      const info = await transporter.sendMail({
        from: 'mandar.technocommet@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
      });

      await transporter.sendMail(info)
}

module.exports = sendmail