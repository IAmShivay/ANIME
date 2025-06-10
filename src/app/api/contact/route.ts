import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/utils/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required',
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      )
    }

    // Send email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 40px 20px; background-color: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2; font-size: 14px;">
              <strong>Note:</strong> Please respond to this inquiry within 24 hours.
            </p>
          </div>
        </div>
      </div>
    `

    // Send confirmation email to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 40px 20px; background-color: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for reaching out to AnimeScience! We've received your message and our team will get back to you within 24 hours.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 4px;">${message}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            In the meantime, feel free to browse our latest anime fashion collection or check out our FAQ section for quick answers to common questions.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/shop" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;
                      margin-right: 10px;">
              Shop Collection
            </a>
            <a href="${process.env.NEXTAUTH_URL}/contact" 
               style="background: transparent; 
                      color: #667eea; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold;
                      display: inline-block;
                      border: 2px solid #667eea;">
              View FAQ
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; text-align: center;">
              Best regards,<br>
              The AnimeScience Team<br>
              <a href="mailto:support@animescience.com" style="color: #667eea;">support@animescience.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    // Send emails
    const [adminEmailResult, userEmailResult] = await Promise.all([
      sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@animescience.com',
        subject: `New Contact Form: ${subject}`,
        html: adminEmailHtml,
      }),
      sendEmail({
        to: email,
        subject: 'Thank you for contacting AnimeScience!',
        html: userEmailHtml,
      }),
    ])

    if (!adminEmailResult.success || !userEmailResult.success) {
      console.error('Email sending failed:', { adminEmailResult, userEmailResult })
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send email',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })

  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
