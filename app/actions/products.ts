"use server"

import prisma from '@/lib/prisma'
import { Dimension, Unit } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'SELLER') {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const dimension = formData.get('dimension') as Dimension
  const price = formData.get('price') as string
  const pricingUnit = formData.get('pricingUnit') as Unit
  const inventoryQuantity = formData.get('inventoryQuantity') as string

  // Simple validation
  if (!name || !dimension || !price || !pricingUnit || !inventoryQuantity) {
    throw new Error('Missing required fields')
  }

  await prisma.product.create({
    data: {
      name,
      description,
      dimension,
      price,
      pricingUnit,
      inventoryQuantity,
      sellerId: session.user.id,
    }
  })

  revalidatePath('/seller/products')
  redirect('/seller/products')
}
