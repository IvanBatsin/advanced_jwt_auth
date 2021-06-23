import nodemailer from 'nodemailer';

class MailService {
  transporter: any;

  constructor(){
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'daphney65@ethereal.email',
        pass: 'f42hTcUECvG8eGJ35P'
      }
    });
  }

  async sendActivationEmail(to: string, link: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: 'daphney65@ethereal.email',
        to,
        subject: 'Activate account on ' + process.env.API_URL,
        text: '',
        html:  
          `
            <div>
              <h1>To activate your account </h1>
              <a href="${link}">${link}</a>
            </div>
          `
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const mailService = new MailService();
export { mailService };