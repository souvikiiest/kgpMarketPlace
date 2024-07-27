import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { sellerEmail, productName, emailBody } = await req.json();

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS_KEY,
      },
      logger: true,
      debug: true,
    });

    let mailOptions = {
      from: process.env.EMAIL_ID,
      to: sellerEmail,
      subject: `Interest in your product: ${productName}`,
      html: emailBody,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    return new NextResponse(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
    });
  }
}
