"""
seed_products.py - Seed all 19 Konark products into MongoDB.
Run once after first setup: python scripts/seed_products.py
Safe to re-run — skips products whose slug already exists.
"""

import asyncio
import sys
import os

# Allow imports from the Backend/ root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import get_settings
from app.models.product import Product


# Complete product list converted from frontend/src/components/product/ProductData.js
PRODUCTS = [
    # ---- Electric Vehicles (type=vehicle) ----
    {
        "slug": "electric-scooter",
        "name": "Electric Scooter",
        "category": "Electric Vehicles",
        "type": "vehicle",
        "price": 27000,
        "rating": 4.6,
        "is_new": True,
        "is_featured": True,
        "short_description": "Smart electric scooter for efficient daily city commuting.",
        "description": (
            "A reliable electric scooter designed for smooth urban mobility. "
            "Features a removable battery, LED lighting, digital display, and "
            "anti-theft security — ideal for everyday travel."
        ),
        "images": ["/productimg/Electric Scooter.png"],
        "specs": {
            "MotorType": "1000W",
            "Tyre": "12 Inch",
            "Brake": "Disc",
            "Battery": "Removable",
            "Range": "Up to 200 Km",
            "DigitalDisplay": "Yes",
            "RemoteControl": "Yes",
            "RemoteAntiTheft": "Yes",
        },
    },
    {
        "slug": "electric-motor-cycle",
        "name": "Electric Motor Cycle",
        "category": "Electric Vehicles",
        "type": "vehicle",
        "price": 45000,
        "rating": 4.7,
        "is_new": True,
        "is_featured": True,
        "short_description": "High-performance electric motorcycle with extended riding range.",
        "description": (
            "Built for power and comfort, this electric motorcycle delivers strong "
            "acceleration, long range, and durability suitable for city and highway use."
        ),
        "images": ["/productimg/Electric Motor Cycle.png"],
        "specs": {
            "Motor": "2000W",
            "Tyre": "21 Inch",
            "Brake": "Disc",
            "Range": "Up to 500 Km",
            "LedLight": "Yes",
            "RemoteControl": "Yes",
            "DigitalDisplay": "Yes",
            "Battery": "Removable",
        },
    },
    {
        "slug": "e-rickshaw",
        "name": "E-Rickshaw",
        "category": "Electric Vehicles",
        "type": "vehicle",
        "price": 85000,
        "rating": 4.5,
        "is_new": False,
        "is_featured": True,
        "short_description": "Heavy-duty electric rickshaw for passenger and goods transport.",
        "description": (
            "Designed for commercial operations, this e-rickshaw offers high load "
            "capacity, durable suspension, and customisable configurations."
        ),
        "images": ["/productimg/E-Rickshaw.png"],
        "specs": {
            "LoadCapacity": "500 Kg",
            "Suspension": "Telescopic / Beam",
            "Battery": "Removable",
            "Tyre": "12 Inch",
            "GroundClearance": "210 mm",
            "Brake": "Disc & Drum",
            "LedLight": "Yes",
            "SolarChargingSupport": "Yes",
            "RoadSweeping": "Available",
            "TowerLight": "Available",
        },
    },
    {
        "slug": "utility-vehicle",
        "name": "Utility Vehicle",
        "category": "Electric Vehicles",
        "type": "vehicle",
        "price": 55000,
        "rating": 4.4,
        "is_new": False,
        "short_description": "Electric utility vehicle for industrial and campus transport.",
        "description": (
            "Custom-built utility EV designed for factories, warehouses, and "
            "industrial campuses with flexible build options."
        ),
        "images": ["/productimg/Utility Vehicle.png"],
        "specs": {
            "Usage": "Industrial Transport",
            "Customization": "Available",
        },
    },

    # ---- Home Appliances (type=product) ----
    {
        "slug": "air-conditioner",
        "name": "Air Conditioner",
        "category": "Home Appliances",
        "type": "product",
        "price": 26000,
        "rating": 4.4,
        "is_new": False,
        "is_featured": True,
        "short_description": "Energy-efficient air conditioner for Indian climate.",
        "description": (
            "Delivers fast and consistent cooling even under voltage fluctuations, "
            "suitable for residential and commercial use."
        ),
        "images": ["/productimg/Air Conditioner.png"],
        "specs": {
            "Capacity": "1 / 1.5 / 2 Ton",
            "Coolant": "R32",
            "Voltage": "180V – 265V",
        },
    },
    {
        "slug": "bldc-fan",
        "name": "BLDC Fan",
        "category": "Home Appliances",
        "type": "product",
        "price": 2200,
        "rating": 4.6,
        "is_new": True,
        "is_featured": True,
        "short_description": "Low power BLDC fan with silent operation.",
        "description": (
            "Consumes significantly less electricity while delivering powerful airflow, "
            "ideal for energy-conscious households."
        ),
        "images": ["/productimg/BLDC Fan.png"],
        "specs": {
            "PowerConsumption": "28W",
            "Warranty": "3 Years",
            "RatedVoltage": "190V – 265V",
            "MotorType": "Original BLDC",
        },
    },
    {
        "slug": "bldc-motor",
        "name": "BLDC Motor",
        "category": "Home Appliances",
        "type": "product",
        "price": 6500,
        "rating": 4.5,
        "is_new": False,
        "short_description": "High-efficiency BLDC motor for EV and industrial use.",
        "description": (
            "Made-in-India (Odisha) BLDC motor available in multiple power ratings "
            "for electric vehicles and automation systems."
        ),
        "images": ["/productimg/BLDC Motor .png"],
        "specs": {
            "PowerOptions": "250W – 2000W",
            "Type": "Hub & Mid Drive",
        },
    },
    {
        "slug": "induction-cooker",
        "name": "Induction Cooker",
        "category": "Home Appliances",
        "type": "product",
        "price": 1650,
        "rating": 4.3,
        "is_new": False,
        "short_description": "Compact induction cooker for modern kitchens.",
        "description": "Fast heating, safe cooking, and energy-efficient performance for daily use.",
        "images": ["/productimg/Induction Cooker.png"],
        "specs": {
            "Power": "1000 – 1500W",
            "Voltage": "240V",
            "Warranty": "6 Months",
        },
    },
    {
        "slug": "infra-red-cooker",
        "name": "Infra Red Cooker",
        "category": "Home Appliances",
        "type": "product",
        "price": 1650,
        "rating": 4.2,
        "is_new": False,
        "short_description": "Infrared cooker compatible with all cookware.",
        "description": "Uses infrared heating technology for uniform heat distribution and efficient cooking.",
        "images": ["/productimg/Infra Red Cooker.png"],
        "specs": {
            "Power": "1000 – 1500W",
            "Voltage": "240V",
            "Warranty": "6 Months",
        },
    },
    {
        "slug": "water-purifier",
        "name": "Water Purifier",
        "category": "Home Appliances",
        "type": "product",
        "price": 4800,
        "rating": 4.4,
        "is_new": False,
        "short_description": "Multi-stage RO water purifier for clean drinking water.",
        "description": "Effectively removes impurities and improves taste, ensuring safe water for households.",
        "images": ["/productimg/Water Purifier.png"],
        "specs": {
            "Stages": "6 Layer RO",
        },
    },
    {
        "slug": "android-tv",
        "name": "Android TV",
        "category": "Home Appliances",
        "type": "product",
        "price": 0,
        "rating": 4.5,
        "is_new": True,
        "short_description": "Smart Android TV with 4K display support.",
        "description": "Enjoy immersive entertainment with Android OS, 4K resolution, and powerful audio.",
        "images": ["/productimg/Android TV.png"],
        "specs": {
            "OS": "Android 14",
            "Resolution": "4K",
            "PriceNote": "According to size",
            "InbuiltApps": "Yes",
        },
    },

    # ---- Industrial (type=product) ----
    {
        "slug": "hybrid-cold-storage",
        "name": "Hybrid Cold Storage",
        "category": "Industrial Equipment",
        "type": "product",
        "price": 250,
        "rating": 4.7,
        "is_new": True,
        "short_description": "Solar-powered hybrid cold storage solution.",
        "description": (
            "Supports solar, battery, grid, and DG power sources with "
            "precise temperature control down to -40°C."
        ),
        "images": ["/productimg/Hybrid Cold Storage.png"],
        "specs": {
            "Temperature": "-40°C",
            "Pricing": "₹250 per sq.ft",
            "InsulatedWall": "120 mm PUF",
            "TransportableWheel": "Yes",
            "DigitalDisplay": "Yes",
            "OperatingSystem": "Automatic Control System",
            "AutoSwitch": "Available",
            "InnerPartition": "Available",
            "SubChamber": "Available",
        },
    },

    # ---- Industrial Components (type=product) ----
    {
        "slug": "cooling-coil",
        "name": "Cooling Coil",
        "category": "Industrial Components",
        "type": "product",
        "price": 300,
        "rating": 4.4,
        "is_new": False,
        "short_description": "High-efficiency cooling coil for HVAC systems.",
        "description": "Manufactured using copper pipes and aluminium fins for superior heat transfer.",
        "images": ["/productimg/Cooling Coil.png"],
        "specs": {
            "Pricing": "₹300 per running inch",
            "PipeMaterial": "Copper",
            "TinMaterial": "Aluminium",
            "BodyMaterial": "Steel",
            "Coating": "Bronze",
        },
    },
    {
        "slug": "condenser-coil",
        "name": "Condenser Coil",
        "category": "Industrial Components",
        "type": "product",
        "price": 300,
        "rating": 4.4,
        "is_new": False,
        "short_description": "Durable condenser coil for industrial cooling.",
        "description": "Designed for high thermal efficiency and long operational life.",
        "images": ["/productimg/Condenser Coil.png"],
        "specs": {
            "Pricing": "₹300 per running inch",
        },
    },
    {
        "slug": "air-conditioner-outer-body",
        "name": "Air Conditioner Outer Body",
        "category": "Industrial Components",
        "type": "product",
        "price": 6500,
        "rating": 4.3,
        "is_new": False,
        "short_description": "Durable AC outer body for OEM manufacturing.",
        "description": "High-strength steel outer casing with corrosion-resistant coating.",
        "images": ["/productimg/Air Conditioner Outer Body.png"],
        "specs": {
            "Material": "Steel",
            "Usage": "OEM Manufacturing",
        },
    },

    # ---- Batteries & Electronics (type=product) ----
    {
        "slug": "lfp-battery",
        "name": "LFP Battery",
        "category": "Batteries",
        "type": "product",
        "price": 14000,
        "rating": 4.8,
        "is_new": True,
        "is_featured": True,
        "short_description": "Long-life LFP battery for EV and solar systems.",
        "description": (
            "High-safety lithium iron phosphate battery with long cycle life "
            "and stable performance for EVs and solar storage."
        ),
        "images": ["/productimg/LFP Battery.png"],
        "specs": {
            "WithBMS": "₹14 per watt",
            "WithoutBMS": "₹11 per watt",
            "BMS": "Yes",
            "Body": "Yes",
            "Chargers": "Yes",
        },
    },
    {
        "slug": "bms",
        "name": "BMS",
        "category": "Electronics",
        "type": "product",
        "price": 0,
        "rating": 4.6,
        "is_new": True,
        "short_description": "Battery Management System for LFP batteries.",
        "description": "Protects batteries from overcharge, discharge, overheating, and cell imbalance.",
        "images": ["/productimg/BMS.png"],
        "specs": {
            "VoltageSupport": "Up to 60V",
        },
    },
    {
        "slug": "battery-charger",
        "name": "Battery Charger",
        "category": "Electronics",
        "type": "product",
        "price": 0,
        "rating": 4.5,
        "is_new": False,
        "short_description": "Adjustable charger for multiple battery capacities.",
        "description": "Supports various current ratings with adjustable voltage control.",
        "images": ["/productimg/Battery Charger.png"],
        "specs": {
            "CurrentOptions": "1A – 20A",
        },
    },

    # ---- Services (type=service) ----
    {
        "slug": "pcb-and-soldering",
        "name": "PCB and Soldering",
        "category": "Industrial Services",
        "type": "service",
        "price": 0,
        "rating": 4.3,
        "is_new": False,
        "short_description": "Professional PCB assembly and soldering services.",
        "description": "Reliable PCB manufacturing, assembly, and soldering for industrial and electronic products.",
        "images": ["/productimg/PCB and Soldering.png"],
        "specs": {
            "ServiceType": "PCB Assembly & Soldering",
        },
    },

    # ---- Additional services (type=service) ----
    {
        "slug": "ac-repair-service",
        "name": "AC Repair & Service",
        "category": "Industrial Services",
        "type": "service",
        "price": 0,
        "rating": 4.7,
        "is_new": False,
        "short_description": "Expert AC repair for all brands. Same-day service across Bhubaneswar.",
        "description": (
            "Our certified technicians handle all AC brands — split, window, cassette. "
            "Diagnosis, gas refill, PCB repair, and deep cleaning, backed by a 90-day service warranty."
        ),
        "images": ["/konark/ac.png"],
        "specs": {
            "ResponseTime": "Within 2 hours",
            "Warranty": "90 days on service",
            "BrandsCovered": "All brands",
            "ServiceArea": "Bhubaneswar, Cuttack, Puri",
        },
    },
    {
        "slug": "ev-charging-station-installation",
        "name": "EV Charging Station Installation",
        "category": "Industrial Services",
        "type": "service",
        "price": 0,
        "rating": 4.8,
        "is_new": False,
        "short_description": "Install home and commercial EV charging stations. Certified installation.",
        "description": (
            "Complete EV charging station setup for homes, offices, and commercial spaces. "
            "AC and DC fast chargers, fully approved installation with all electrical work included."
        ),
        "images": ["/konark/evcharge solution.png"],
        "specs": {
            "ChargerTypes": "AC 3.3kW / 7.4kW / DC 15kW+",
            "InstallationTime": "1-2 days",
            "Warranty": "1 year on installation",
        },
    },
    {
        "slug": "solar-power-plant-installation",
        "name": "Solar Power Plant Installation",
        "category": "Industrial Services",
        "type": "service",
        "price": 0,
        "rating": 4.9,
        "is_new": False,
        "short_description": "Residential and commercial solar power plants. Rooftop to utility scale.",
        "description": (
            "Complete solar power plant installation from design to commissioning. "
            "Grid-tied, off-grid, and hybrid systems, with government subsidy assistance "
            "and a 25-year panel warranty."
        ),
        "images": ["/konark/solarpannel solutions.png"],
        "specs": {
            "CapacityRange": "1kW to 1MW+",
            "SystemTypes": "Grid-tied / Off-grid / Hybrid",
            "PanelWarranty": "25 years",
        },
    },
    {
        "slug": "wind-power-plant-installation",
        "name": "Wind Power Plant Installation",
        "category": "Industrial Services",
        "type": "service",
        "price": 0,
        "rating": 4.7,
        "is_new": True,
        "short_description": "Small and large-scale wind energy solutions for farms and industries.",
        "description": (
            "Wind power plant installation for agricultural, industrial, and institutional use, "
            "with hybrid wind-solar systems available and complete civil and electrical work."
        ),
        "images": ["/konark/productenergystored.png"],
        "specs": {
            "CapacityRange": "1kW to 500kW",
            "Types": "Horizontal / Vertical axis",
            "Hybrid": "Wind + Solar available",
        },
    },
    {
        "slug": "battery-swap-service",
        "name": "Battery Swap Service",
        "category": "Industrial Services",
        "type": "service",
        "price": 150,
        "rating": 4.8,
        "is_new": False,
        "short_description": "Exchange your discharged EV battery for a fully charged one. Home pickup available.",
        "description": (
            "Hand us your discharged LFP or lead-acid EV battery and drive away with a fully "
            "charged replacement. Home pickup available across Bhubaneswar with real-time token tracking."
        ),
        "images": ["/konark/productevbatterie.png"],
        "specs": {
            "SwapFee": "From ₹150",
            "Turnaround": "Same day",
            "BatteryTypes": "LFP / Lead Acid / NMC",
        },
    },

    # ---- EV Cars, upcoming (type=vehicle) ----
    {
        "slug": "konark-ev-car-x1",
        "name": "Konark EV Car X1",
        "category": "Electric Vehicles",
        "type": "vehicle",
        "price": 0,
        "rating": 0,
        "is_new": True,
        "in_stock": False,
        "short_description": "Upcoming electric car from Konark Industry. Register your interest today.",
        "description": (
            "The Konark EV Car X1 is our upcoming electric sedan designed for Indian roads. "
            "Spacious 5-seater, 300+ km range, with fast charging support. Expected launch 2025-26."
        ),
        "images": ["/konark/car-1 (1).png"],
        "specs": {
            "Status": "Upcoming",
            "ExpectedLaunch": "2025-26",
            "Range": "300+ km (estimated)",
            "Seating": "5 passengers",
        },
    },
    {
        "slug": "konark-ev-car-x2",
        "name": "Konark EV Car X2",
        "category": "Electric Vehicles",
        "type": "vehicle",
        "price": 0,
        "rating": 0,
        "is_new": True,
        "in_stock": False,
        "short_description": "Upcoming electric SUV. Designed for Odisha terrain.",
        "description": (
            "The Konark EV Car X2 SUV is built for both city roads and Odisha terrain. "
            "7-seater capacity with high ground clearance and an estimated 280km range."
        ),
        "images": ["/konark/car-2.png"],
        "specs": {
            "Status": "Upcoming",
            "Type": "Electric SUV",
            "Seating": "7 passengers",
            "Range": "280 km (estimated)",
        },
    },
]


async def seed():
    """
    Connect to MongoDB and insert any products whose slug does not yet exist.
    Prints a summary of inserted vs skipped products.
    """
    settings = get_settings()

    # Connect directly (not via app lifespan, since this is a standalone script)
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[Product],
    )

    inserted = 0
    skipped = 0

    for data in PRODUCTS:
        # Skip if a product with this slug already exists
        existing = await Product.find_one({"slug": data["slug"]})
        if existing:
            print(f"  SKIP  {data['slug']} (already exists)")
            skipped += 1
            continue

        product = Product(**data)
        await product.insert()
        print(f"  OK    {data['slug']}")
        inserted += 1

    print(f"\nDone. Inserted: {inserted} | Skipped: {skipped} | Total: {len(PRODUCTS)}")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
