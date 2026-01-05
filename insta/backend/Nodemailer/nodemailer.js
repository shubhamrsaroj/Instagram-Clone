import nodemailer from "nodemailer";

export const sendEmail=async(to,subject,text)=>{

    const transporter =nodemailer.createTransport({
        
        service:"gmail",
        auth:{
            user:"shubhamrsaroj229@gmail.com",
            pass:"efclfylixqlzaftc"
        }

    });

    await transporter.sendMail({
        from:"shubhamrsarj229@gmail.com",
        to,
        subject,
        text
    });

}
