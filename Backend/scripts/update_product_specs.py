"""
update_product_specs.py - Update specs for products that were seeded with thin specs.
seed_products.py is insert-only (skips existing slugs), so already-seeded
products never receive spec improvements made there. This script updates
them directly by slug. Safe to re-run.
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(
  os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.product import Product
from dotenv import load_dotenv
load_dotenv()

UPDATED_SPECS = {
  'water-purifier': {
    'Purification': 'RO + UV + UF',
    'Capacity': '10 litres/hour',
    'TDS Reduction': 'Up to 2000 ppm',
    'Storage Tank': '7 litres',
    'Power': '36W',
    'Warranty': '1 year comprehensive',
  },
  'bms': {
    'Voltage Range': '24V - 96V',
    'Current Rating': 'Up to 200A',
    'Cell Chemistry': 'LFP / NMC / LTO',
    'Protection': 'Overcharge, Over-discharge, Short circuit',
    'Communication': 'UART / CAN Bus',
    'Operating Temp': '-20 to 60 degrees C',
  },
  'battery-charger': {
    'Input Voltage': '180-260V AC',
    'Output Voltage': '48V / 60V / 72V',
    'Charging Current': '10A / 20A / 30A',
    'Efficiency': '>92%',
    'Protection': 'Short circuit, Over voltage',
    'Connector': 'Anderson / XT60',
  },
  'bldc-motor': {
    'Power Rating': '250W - 5000W',
    'Voltage': '24V / 48V / 72V',
    'RPM': '300 - 3000 RPM',
    'Efficiency': '>85%',
    'Cooling': 'Air cooled',
    'Applications': 'EV, Industrial, Agriculture',
  },
  'utility-vehicle': {
    'Payload': 'Up to 500kg',
    'Range': 'Up to 80km per charge',
    'Motor': '2000W BLDC',
    'Battery': '48V 100Ah LFP',
    'Max Speed': '25 km/h',
    'Charging Time': '6-8 hours',
  },
  'cooling-coil': {
    'Compatible': 'All split AC brands',
    'Capacity Range': '1 ton to 5 ton',
    'Material': 'Copper / Aluminium',
    'Warranty': '6 months',
    'Availability': 'In stock for major brands',
  },
  'condenser-coil': {
    'Compatible': 'All split AC brands',
    'Capacity Range': '1 ton to 5 ton',
    'Material': 'Copper / Aluminium fins',
    'Warranty': '6 months',
    'Applications': 'Residential and commercial AC',
  },
  'air-conditioner-outer-body': {
    'Compatible': 'All split AC brands',
    'Material': 'Galvanized steel',
    'Finish': 'Powder coated',
    'Warranty': '6 months',
    'Sizes': '1 ton, 1.5 ton, 2 ton',
  },
  'pcb-and-soldering': {
    'Services': 'PCB repair, component replacement',
    'Equipment': 'AC PCB, washing machine PCB, TV board',
    'Turnaround': '24-48 hours',
    'Warranty': '3 months on repair',
    'On-site': 'Available for bulk orders',
  },
}

async def update_specs():
  client = AsyncIOMotorClient(
    os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
  )
  await init_beanie(
    database=client[
      os.getenv('MONGODB_DB_NAME', 'konark_industry')
    ],
    document_models=[Product]
  )

  updated = 0
  for slug, specs in UPDATED_SPECS.items():
    product = await Product.find_one(
      Product.slug == slug)
    if product:
      product.specs = specs
      await product.save()
      print(f'  OK    {slug}')
      updated += 1
    else:
      print(f'  SKIP  {slug} (not found)')

  print(f'\nUpdated {updated} products')
  client.close()

if __name__ == '__main__':
  asyncio.run(update_specs())
