export const orderConfirmationTemplate = (order: any) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        /* Add your email styles here */
      </style>
    </head>
    <body>
      <h1>Order Confirmation</h1>
      <p>Thank you for your order #${order.id}!</p>
      <!-- Add more order details here -->
    </body>
  </html>
`

export const welcomeEmailTemplate = (user: any) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        /* Add your email styles here */
      </style>
    </head>
    <body>
      <h1>Welcome to AnimeScience!</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining our community...</p>
    </body>
  </html>
`