import { createClient } from '@/lib/supabase/server'
import { SortingState } from '@tanstack/react-table'

import { Payment } from "./types"

export async function getPayments(
  page: number = 1,
  pageSize: number = 10,
  sorting: SortingState = []
): Promise<{ data: Payment[]; totalCount: number }> {
  const supabase = await createClient()
  
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // Get total count
  const { count } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })

  // Build the query with sorting
  let query = supabase
    .from('payments')
    .select('*')
    .range(from, to)

  // Apply sorting if provided
  if (sorting.length > 0) {
    sorting.forEach((sort) => {
      query = query.order(sort.id, { ascending: !sort.desc })
    })
  } else {
    // Default sorting by id if no sorting is specified
    query = query.order('id', { ascending: true })
  }

  const { data, error } = await query

  if (error) {
    console.error(error)
    throw new Error('Failed to fetch payments')
  }

  return {
    data: data || [],
    totalCount: count || 0
  }
}