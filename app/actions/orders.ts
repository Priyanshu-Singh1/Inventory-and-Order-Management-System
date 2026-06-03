"use server"

import prisma from '@/lib/prisma'
import { convertToBase, calculatePrice } from '@/lib/units'
import { Unit } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

type OrderItemInput = {
  productId: string
  quantity: number
  unit: Unit
}

export async function placeOrder(items: OrderItemInput[]) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'BUYER') {
    throw new Error('Unauthorized')
  }

  if (!items || items.length === 0) {
    throw new Error('Cart is empty')
  }

  // Calculate totals and verify inventory
  let totalAmount = 0
  const orderItemsData: {
    productId: string
    displayQuantity: number
    displayUnit: Unit
    orderedBaseQuantity: number
    priceAtTimeOfOrder: number
  }[] = []

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) throw new Error(`Product not found: ${item.productId}`)

    const baseQuantity = convertToBase(item.quantity, item.unit)
    const price = calculatePrice(item.quantity, item.unit, product.price.toString(), product.pricingUnit)

    // Check inventory
    if (product.inventoryQuantity.lessThan(baseQuantity)) {
      throw new Error(`Insufficient inventory for ${product.name}`)
    }

    totalAmount += price.toNumber()
    
    orderItemsData.push({
      productId: product.id,
      displayQuantity: item.quantity,
      displayUnit: item.unit,
      orderedBaseQuantity: baseQuantity.toNumber(),
      priceAtTimeOfOrder: price.toNumber()
    })
  }

  // Create order and reduce inventory in a transaction
  await prisma.$transaction(async (tx) => {
    // Deduct inventory
    for (const itemData of orderItemsData) {
      await tx.product.update({
        where: { id: itemData.productId },
        data: {
          inventoryQuantity: {
            decrement: itemData.orderedBaseQuantity
          }
        }
      })
    }

    // Create Order
    await tx.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: 'QUOTATION',
        items: {
          create: orderItemsData
        }
      }
    })
  })

  return { success: true }
}
