"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Payment } from './types'

export async function deletePayments(ids: string[]): Promise<{ 
  success: boolean; 
  error?: string; 
  deletedCount?: number 
}> {
  try {
    const supabase = await createClient()
    
    const { error, count } = await supabase
      .from('payments')
      .delete({ count: 'exact' })
      .in('id', ids)

    if (error) {
      console.error('Error deleting payments:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Revalidate the page to refresh the data
    revalidatePath('/test/table-basic')

    return {
      success: true,
      deletedCount: count || 0
    }
  } catch (error) {
    console.error('Unexpected error deleting payments:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while deleting payments'
    }
  }
}

export async function createPayment(data: Partial<Payment>): Promise<{ 
  success: boolean; 
  error?: string; 
  data?: Payment;
}> {
  try {
    // Validate required fields
    if (!data.amount || !data.status || !data.email) {
      return {
        success: false,
        error: 'Missing required fields: amount, status, and email are required'
      }
    }

    const supabase = await createClient()
    
    // Create the insert data without the id field
    const insertData = {
      amount: data.amount,
      status: data.status,
      email: data.email
    }
    
    const { data: result, error } = await supabase
      .from('payments')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating payment:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Revalidate the page to refresh the data
    revalidatePath('/test/table-basic')

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Unexpected error creating payment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while creating payment'
    }
  }
}

export async function updatePayment(
  id: string,
  data: Partial<Payment>
): Promise<{ 
  success: boolean; 
  error?: string; 
  data?: Payment;
}> {
  try {
    const supabase = await createClient()
    
    // Filter out the id field to prevent updating identity column
    const updateData = { ...data }
    delete updateData.id
    
    const { data: result, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Revalidate the page to refresh the data
    revalidatePath('/test/table-basic')

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Unexpected error updating payment:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating payment'
    }
  }
}

export async function updatePayments(
  ids: string[],
  data: Partial<Payment>
): Promise<{ 
  success: boolean; 
  error?: string; 
  updatedCount?: number;
}> {
  try {
    const supabase = await createClient()
    
    // Filter out the id field to prevent updating identity column
    const updateData = { ...data }
    delete updateData.id
    
    const { error, count } = await supabase
      .from('payments')
      .update(updateData, { count: 'exact' })
      .in('id', ids)

    if (error) {
      console.error('Error updating payments:', error)
      return {
        success: false,
        error: error.message
      }
    }

    // Revalidate the page to refresh the data
    revalidatePath('/test/table-basic')

    return {
      success: true,
      updatedCount: count || 0
    }
  } catch (error) {
    console.error('Unexpected error updating payments:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating payments'
    }
  }
}
