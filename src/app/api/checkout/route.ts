import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/razorpay'
import { supabase } from '@/lib/supabase/config'

export async function POST(req: Request) {
  try {
    const { items, userId } = await req.json()
    
    // Calculate total amount
    const total = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
    
    // Create Razorpay order
    const order = await createOrder(total)
    
    // Store order in database
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          order_id: order.id,
          amount: total,
          status: 'pending',
          items: items
        }
      ])
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ order, data })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}