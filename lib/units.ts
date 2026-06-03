import { Dimension, Unit } from '@prisma/client'
import { Decimal } from 'decimal.js'

// Define conversion factors relative to the base unit of their dimension
// WEIGHT base: g
// VOLUME base: mL
// COUNT base: item
const UNIT_FACTORS: Record<Unit, number> = {
  g: 1,
  kg: 1000,
  mL: 1,
  L: 1000,
  item: 1,
}

export const getAvailableUnits = (dimension: Dimension): Unit[] => {
  switch (dimension) {
    case 'WEIGHT':
      return ['g', 'kg']
    case 'VOLUME':
      return ['mL', 'L']
    case 'COUNT':
      return ['item']
    default:
      return []
  }
}

export const getBaseUnit = (dimension: Dimension): Unit => {
  switch (dimension) {
    case 'WEIGHT':
      return 'g'
    case 'VOLUME':
      return 'mL'
    case 'COUNT':
      return 'item'
  }
}

/**
 * Converts a quantity from a specific unit to the dimension's base unit.
 */
export const convertToBase = (quantity: string | number | Decimal, unit: Unit): Decimal => {
  const factor = UNIT_FACTORS[unit]
  return new Decimal(quantity).mul(factor)
}

/**
 * Converts a quantity from the dimension's base unit to a specific unit.
 */
export const convertFromBase = (baseQuantity: string | number | Decimal, unit: Unit): Decimal => {
  const factor = UNIT_FACTORS[unit]
  return new Decimal(baseQuantity).div(factor)
}

/**
 * Calculates the total price for an ordered quantity.
 * 
 * @param orderQuantity The quantity ordered (e.g., 500)
 * @param orderUnit The unit of the ordered quantity (e.g., 'g')
 * @param price The rate price defined for the product (e.g., 50)
 * @param pricingUnit The unit the rate is defined in (e.g., 'kg')
 * @returns The total price in INR as a Decimal
 */
export const calculatePrice = (
  orderQuantity: string | number | Decimal,
  orderUnit: Unit,
  price: string | number | Decimal,
  pricingUnit: Unit
): Decimal => {
  // 1. Convert order quantity to base unit
  const orderBaseQty = convertToBase(orderQuantity, orderUnit)
  
  // 2. We need to find how many 'pricingUnits' are in the ordered quantity
  // We convert the base quantity back into the pricing unit.
  // E.g., 500g base -> convertFromBase(500, 'kg') -> 0.5 kg
  const equivalentPricingUnitQty = convertFromBase(orderBaseQty, pricingUnit)

  // 3. Total price = equivalent amount * price per pricing unit
  // E.g., 0.5 kg * 50 INR/kg = 25 INR
  return equivalentPricingUnitQty.mul(new Decimal(price))
}

/**
 * Helper to display values nicely
 */
export const formatCurrency = (amount: string | number | Decimal): string => {
  return new Decimal(amount).toDecimalPlaces(2).toString() + ' INR'
}
