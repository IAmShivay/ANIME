import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

interface OTPEmailOptions {
  email: string
  otp: string
  name?: string
  type?: 'signup' | 'password-reset' | 'email-verification'
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Bindass'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  async sendOTPEmail(options: OTPEmailOptions): Promise<boolean> {
    const { email, otp, name = 'User', type = 'signup' } = options

    let subject = ''
    let title = ''
    let message = ''

    switch (type) {
      case 'signup':
        subject = 'Welcome to Bindass - Verify Your Email'
        title = 'Welcome to Bindass!'
        message = 'Thank you for signing up! Please verify your email address to complete your registration.'
        break
      case 'password-reset':
        subject = 'Reset Your Bindass Password'
        title = 'Password Reset Request'
        message = 'You requested to reset your password. Use the OTP below to proceed.'
        break
      case 'email-verification':
        subject = 'Verify Your Bindass Email'
        title = 'Email Verification'
        message = 'Please verify your email address using the OTP below.'
        break
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 24px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 20px;
            }
            .title {
                color: #1f2937;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .message {
                color: #6b7280;
                font-size: 16px;
                margin-bottom: 30px;
            }
            .otp-container {
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-label {
                color: white;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            .otp-code {
                color: white;
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
            }
            .otp-note {
                color: rgba(255, 255, 255, 0.8);
                font-size: 12px;
                margin-top: 10px;
            }
            .instructions {
                background: #f3f4f6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .instructions h3 {
                color: #1f2937;
                font-size: 16px;
                margin-bottom: 10px;
            }
            .instructions ul {
                color: #6b7280;
                font-size: 14px;
                margin: 0;
                padding-left: 20px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #9ca3af;
                font-size: 12px;
            }
            .warning {
                background: #fef3cd;
                border: 1px solid #fbbf24;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Bindass</div>
                <h1 class="title">${title}</h1>
                <p class="message">Hello ${name},</p>
                <p class="message">${message}</p>
            </div>

            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="otp-note">This code expires in 10 minutes</div>
            </div>

            <div class="instructions">
                <h3>How to use this code:</h3>
                <ul>
                    <li>Enter this 6-digit code on the verification page</li>
                    <li>The code is valid for 10 minutes only</li>
                    <li>Don't share this code with anyone</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
            </div>

            <div class="warning">
                <strong>Security Notice:</strong> This OTP is confidential. Bindass will never ask for your OTP via phone or email. If you didn't request this verification, please ignore this email.
            </div>

            <div class="footer">
                <p>This email was sent by Bindass - Premium Anime Fashion</p>
                <p>If you have any questions, contact us at support@bindass.com</p>
                <p>&copy; 2024 Bindass. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `

    const text = `
    ${title}
    
    Hello ${name},
    
    ${message}
    
    Your verification code: ${otp}
    
    This code expires in 10 minutes.
    
    If you didn't request this verification, please ignore this email.
    
    Best regards,
    Bindass Team
    `

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text
    })
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = 'Welcome to Bindass - Your Anime Fashion Journey Begins!'
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 24px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 20px;
            }
            .title {
                color: #1f2937;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #9ca3af;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Bindass</div>
                <h1 class="title">Welcome to Bindass!</h1>
                <p>Hello ${name},</p>
                <p>Welcome to the ultimate destination for anime fashion! Your account has been successfully created and verified.</p>
                <p>Get ready to explore our exclusive collection of premium anime-inspired clothing and accessories.</p>
                
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="cta-button">
                    Start Shopping
                </a>
                
                <p>Thank you for joining our community of anime fashion enthusiasts!</p>
            </div>

            <div class="footer">
                <p>This email was sent by Bindass - Premium Anime Fashion</p>
                <p>If you have any questions, contact us at support@bindass.com</p>
                <p>&copy; 2024 Bindass. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `

    return await this.sendEmail({
      to: email,
      subject,
      html
    })
  }
}

export const emailService = new EmailService()
export default emailService
