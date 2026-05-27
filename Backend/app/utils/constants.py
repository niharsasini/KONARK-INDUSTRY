"""
constants.py - Application-wide constants.
"""

# Indian cities with Konark service coverage
ODISHA_CITIES = [
    "Bhubaneswar",
    "Cuttack",
    "Puri",
    "Rourkela",
    "Sambalpur",
    "Berhampur",
    "Brahmapur",
    "Balasore",
    "Baripada",
    "Jharsuguda",
    "Angul",
    "Dhenkanal",
    "Kendrapara",
    "Jagatsinghpur",
    "Koraput",
]

# Service types offered by Konark
SERVICE_TYPES = [
    "AC Repair",
    "AC Installation",
    "AC Servicing",
    "EV Charger Installation",
    "EV Battery Replacement",
    "Home Wiring",
    "Industrial Wiring",
    "Battery Setup",
    "Solar Panel Installation",
    "Solar Servicing",
    "PCB Repair",
    "Industrial Electrical",
]

# Product categories for filter UI
PRODUCT_CATEGORIES = [
    "Electric Vehicles",
    "Home Appliances",
    "Industrial Equipment",
    "Industrial Components",
    "Batteries",
    "Electronics",
    "Industrial Services",
]

# GST rate applied to all products
GST_RATE = 0.18

# Free delivery threshold in INR
FREE_DELIVERY_ABOVE = 5000

# Flat delivery charge below the threshold
DELIVERY_CHARGE = 199
