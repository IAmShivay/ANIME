import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const createOrder = async (amount: number) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      payment_capture: 1,
    })
    return order
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}