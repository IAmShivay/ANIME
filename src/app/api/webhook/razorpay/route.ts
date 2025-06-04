import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/config'
import { sendEmail } from '@/lib/email/sendEmail'
import { orderConfirmationTemplate } from '@/lib/email/templates'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    
    // Verify webhook signature
    // Update order status
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('order_id', payload.payload.payment.entity.order_id)
      .select()
      .single()
    
    if (error) throw error
    
    // Send confirmation email
    await sendEmail({
      to: order.user_email,
      subject: 'Order Confirmation',
      html: orderConfirmationTemplate(order)
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}