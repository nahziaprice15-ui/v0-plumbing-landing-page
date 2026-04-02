'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function getAdminClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') return null
  return supabase
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export async function createServiceCategory(formData: FormData) {
  const supabase = await getAdminClient()
  if (!supabase) return

  const name = String(formData.get('name') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const sortOrder = Number(formData.get('sortOrder') ?? 0)
  const slug = slugRaw ? slugify(slugRaw) : slugify(name)
  if (!name || !slug) return

  const { error } = await supabase.from('service_categories').insert({
    name,
    slug,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  })
  if (error) console.error('[catalog] createServiceCategory', error.message)
  revalidatePath('/admin/service-categories')
}

export async function updateServiceCategory(formData: FormData) {
  const supabase = await getAdminClient()
  if (!supabase) return

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const sortOrder = Number(formData.get('sortOrder') ?? 0)
  if (!id || !name) return
  const slug = slugRaw ? slugify(slugRaw) : slugify(name)
  if (!slug) return

  const { error } = await supabase
    .from('service_categories')
    .update({
      name,
      slug,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq('id', id)
  if (error) console.error('[catalog] updateServiceCategory', error.message)
  revalidatePath('/admin/service-categories')
}

export async function deleteServiceCategory(formData: FormData) {
  const supabase = await getAdminClient()
  if (!supabase) return

  const id = String(formData.get('id') ?? '')
  if (!id) return

  const { error } = await supabase.from('service_categories').delete().eq('id', id)
  if (error) console.error('[catalog] deleteServiceCategory', error.message)
  revalidatePath('/admin/service-categories')
  revalidatePath('/admin/services')
}

export async function createServiceType(formData: FormData) {
  const supabase = await getAdminClient()
  if (!supabase) return

  const title = String(formData.get('title') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const categoryId = String(formData.get('categoryId') ?? '').trim()
  const durationMinutes = Number(formData.get('durationMinutes') ?? 60)
  const slug = slugRaw ? slugify(slugRaw) : slugify(title)
  if (!title || !slug) return

  const { error } = await supabase.from('service_types').insert({
    slug,
    title,
    category_id: categoryId || null,
    duration_minutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 60,
    is_active: true,
  })
  if (error) console.error('[catalog] createServiceType', error.message)
  revalidatePath('/admin/services')
}

export async function updateServiceType(formData: FormData) {
  const supabase = await getAdminClient()
  if (!supabase) return

  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const slugRaw = String(formData.get('slug') ?? '').trim()
  const categoryId = String(formData.get('categoryId') ?? '').trim()
  const durationMinutes = Number(formData.get('durationMinutes') ?? 60)
  if (!id || !title) return
  const slug = slugRaw ? slugify(slugRaw) : slugify(title)
  if (!slug) return

  const { error } = await supabase
    .from('service_types')
    .update({
      slug,
      title,
      category_id: categoryId || null,
      duration_minutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 60,
    })
    .eq('id', id)
  if (error) console.error('[catalog] updateServiceType', error.message)
  revalidatePath('/admin/services')
}

export async function setServiceTypeActive(formData: FormData) {
  const supabase = await getAdminClient()
  if (!supabase) return

  const id = String(formData.get('id') ?? '')
  const active = String(formData.get('active') ?? '') === '1'
  if (!id) return

  const { error } = await supabase.from('service_types').update({ is_active: active }).eq('id', id)
  if (error) console.error('[catalog] setServiceTypeActive', error.message)
  revalidatePath('/admin/services')
}
