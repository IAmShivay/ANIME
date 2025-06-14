import nodemailer from 'nodemailer'

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const subject = 'Welcome to Bindass!'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Bindass!</h1>
      </div>

      <div style="padding: 40px 20px; background-color: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>

        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for joining Bindass! We're excited to have you as part of our community of anime fashion enthusiasts.
        </p>

        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          Explore our premium collection of anime fashion, streetwear, and exclusive merchandise.
          Get ready to express your passion with our unique designs!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/shop" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Start Shopping
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmail({ to: userEmail, subject, html })
}

// Define order interface for email
interface OrderForEmail {
  _id: string
  orderNumber: string
  items: Array<{
    product: {
      name: string
    }
    quantity: number
    total: number
  }>
  pricing: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export async function sendOrderConfirmationEmail(
  userEmail: string,
  userName: string,
  order: OrderForEmail
) {
  const subject = `Order Confirmation - ${order.orderNumber}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Order #${order.orderNumber}</p>
      </div>
      
      <div style="padding: 40px 20px; background-color: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for your order! We've received your order and are preparing it for shipment.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Order Details</h3>
          
          ${order.items.map((item) => `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0; color: #333;">${item.product.name}</h4>
                <p style="margin: 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-weight: bold; color: #333;">₹${item.total.toFixed(2)}</p>
              </div>
            </div>
          `).join('')}

          <div style="padding-top: 15px; border-top: 2px solid #333;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #666;">Subtotal:</span>
              <span style="color: #333;">₹${order.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #666;">Shipping:</span>
              <span style="color: #333;">₹${order.pricing.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="color: #666;">Tax:</span>
              <span style="color: #333;">₹${order.pricing.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
              <span style="color: #333;">Total:</span>
              <span style="color: #333;">₹${order.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
          <p style="color: #666; margin: 0; line-height: 1.6;">
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.address1}<br>
            ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br>' : ''}
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL}/orders/${order._id}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Track Your Order
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 14px; text-align: center;">
            We'll send you another email when your order ships. If you have any questions, contact our support team.
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmail({ to: userEmail, subject, html })
}

export async function sendPasswordResetEmail(userEmail: string, resetToken: string) {
  const subject = 'Reset Your Password - Bindass'
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
      </div>
      
      <div style="padding: 40px 20px; background-color: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          This link will expire in 1 hour for security reasons.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          If you didn't request this password reset, please ignore this email.
        </p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 14px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
          </p>
        </div>
      </div>
    </div>
  `

  return sendEmail({ to: userEmail, subject, html })
}
