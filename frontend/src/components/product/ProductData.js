/* ================= CATEGORY CONFIG ================= */

export const CATEGORIES = {
  EV: "Electric Vehicles",
  HOME: "Home Appliances",
  INDUSTRIAL: "Industrial Equipment",
  COMPONENTS: "Industrial Components",
  BATTERY: "Batteries",
  ELECTRONICS: "Electronics",
  SERVICES: "Industrial Services",
};

/* ================= PRODUCT DATA ================= */

export const products = [
  /* ================= ELECTRIC VEHICLES ================= */

  {
    id: 1,
    slug: "electric-scooter",
    name: "Electric Scooter",
    category: CATEGORIES.EV,
    price: 27000,
    rating: 4.6,
    isNew: true,
    image: "/productimg/Electric Scooter.png",
    shortDescription:
      "Smart electric scooter for efficient daily city commuting.",
    description:
      "A reliable electric scooter designed for smooth urban mobility. It features a removable battery, LED lighting, digital display, and anti-theft security, making it ideal for everyday travel.",
    specifications: {
      MotorType: "1000W",
      Tyre: "12 Inch",
      Brake: "Disc",
      Battery: "Removable",
      Range: "Up to 200 Km",

      DigitalDisplay: "Yes",
      RemoteControl: "Yes",
      RemoteAntiTheft: "Yes",
    },
  },

  {
    id: 2,
    slug: "electric-motor-cycle",
    name: "Electric Motor Cycle",
    category: CATEGORIES.EV,
    price: 45000,
    rating: 4.7,
    isNew: true,
    image: "/productimg/Electric Motor Cycle.png",
    shortDescription:
      "High-performance electric motorcycle with extended riding range.",
    description:
      "Built for power and comfort, this electric motorcycle delivers strong acceleration, long range, and durability suitable for city and highway use.",
    specifications: {
      Motor: "2000W",
      Tyre: "21 Inch",
      Brake: "Disc",
      Range: "Up to 500 Km",

      LedLight: "Yes",
      RemoteControl: "Yes",
      DigitalDisplay: "Yes",
      Battery: "Removable",
    },
  },

  {
    id: 3,
    slug: "e-rickshaw",
    name: "E-Rickshaw",
    category: CATEGORIES.EV,
    price: 85000,
    rating: 4.5,
    isNew: false,
    image: "/productimg/E-Rickshaw.png",
    shortDescription:
      "Heavy-duty electric rickshaw for passenger and goods transport.",
    description:
      "Designed for commercial operations, this e-rickshaw offers high load capacity, durable suspension, and customizable configurations.",
    specifications: {
      LoadCapacity: "500 Kg",
      Suspension: "Telescopic / Beam",
      Battery: "Removable",

      Tyre: "12 Inch",
      GroundClearance: "210 mm",
      Brake: "Disc & Drum",
      LedLight: "Yes",
      SolarChargingSupport: "Yes",

      RoadSweeping: "Available",
      TowerLight: "Available",
    },
  },

  {
    id: 4,
    slug: "utility-vehicle",
    name: "Utility Vehicle",
    category: CATEGORIES.EV,
    price: 55000,
    rating: 4.4,
    isNew: false,
    image: "/productimg/Utility Vehicle.png",
    shortDescription:
      "Electric utility vehicle for industrial and campus transport.",
    description:
      "Custom-built utility EV designed for factories, warehouses, and industrial campuses with flexible build options.",
    specifications: {
      Usage: "Industrial Transport",
      Customization: "Available",
    },
  },

  /* ================= HOME APPLIANCES ================= */

  {
    id: 5,
    slug: "air-conditioner",
    name: "Air Conditioner",
    category: CATEGORIES.HOME,
    price: 26000,
    rating: 4.4,
    isNew: false,
    image: "/productimg/Air Conditioner.png",
    shortDescription: "Energy-efficient air conditioner for Indian climate.",
    description:
      "Delivers fast and consistent cooling even under voltage fluctuations, suitable for residential and commercial use.",
    specifications: {
      Capacity: "1 / 1.5 / 2 Ton",
      Coolant: "R32",
      Voltage: "180V – 265V",
    },
  },

  {
    id: 6,
    slug: "bldc-fan",
    name: "BLDC Fan",
    category: CATEGORIES.HOME,
    price: 2200,
    rating: 4.6,
    isNew: true,
    image: "/productimg/BLDC Fan.png",
    shortDescription: "Low power BLDC fan with silent operation.",
    description:
      "Consumes significantly less electricity while delivering powerful airflow, ideal for energy savings.",
    specifications: {
      PowerConsumption: "28W",
      Warranty: "3 Years",

      RatedVoltage: "190V – 265V",
      MotorType: "Original BLDC",
    },
  },

  {
    id: 7,
    slug: "bldc-motor",
    name: "BLDC Motor",
    category: CATEGORIES.HOME,
    price: 6500,
    rating: 4.5,
    isNew: false,
    image: "/productimg/BLDC Motor .png",
    shortDescription: "High-efficiency BLDC motor for EV and industrial use.",
    description:
      "Made-in-India(odisha) BLDC motor available in multiple power ratings for electric vehicles and automation systems.",
    specifications: {
      PowerOptions: "250W – 2000W",
      Type: "Hub & Mid Drive",
    },
  },

  {
    id: 8,
    slug: "induction-cooker",
    name: "Induction Cooker",
    category: CATEGORIES.HOME,
    price: 1650,
    rating: 4.3,
    isNew: false,
    image: "/productimg/Induction Cooker.png",
    shortDescription: "Compact induction cooker for modern kitchens.",
    description:
      "Fast heating, safe cooking, and energy-efficient performance for daily household use.",
    specifications: {
      Power: "1000 – 1500W",
      Voltage: "240V",
      Warranty: "6 Months",
    },
  },

  {
    id: 9,
    slug: "infra-red-cooker",
    name: "Infra Red Cooker",
    category: CATEGORIES.HOME,
    price: 1650,
    rating: 4.2,
    isNew: false,
    image: "/productimg/Infra Red Cooker.png",
    shortDescription: "Infrared cooker compatible with all cookware.",
    description:
      "Uses infrared heating technology for uniform heat distribution and efficient cooking.",
    specifications: {
      Power: "1000 – 1500W",
      Voltage: "240V",
      Warranty: "6 Months",
    },
  },

  {
    id: 10,
    slug: "water-purifier",
    name: "Water Purifier",
    category: CATEGORIES.HOME,
    price: 4800,
    rating: 4.4,
    isNew: false,
    image: "/productimg/Water Purifier.png",
    shortDescription: "Multi-stage RO water purifier for clean drinking water.",
    description:
      "Effectively removes impurities and improves taste, ensuring safe water for households.",
    specifications: {
      Stages: "6 Layer RO",
    },
  },

  {
    id: 11,
    slug: "android-tv",
    name: "Android TV",
    category: CATEGORIES.HOME,
    price: 0,
    rating: 4.5,
    isNew: true,
    image: "/productimg/Android TV.png",
    shortDescription: "Smart Android TV with 4K display support.",
    description:
      "Enjoy immersive entertainment with Android OS, high-resolution visuals, and powerful audio.",
    specifications: {
      OS: "Android 14",
      Resolution: "4K",
      According: "To size price",
      Inbuild: "Apps",
    },
  },

  /* ================= INDUSTRIAL / COLD STORAGE ================= */

  {
    id: 12,
    slug: "hybrid-cold-storage",
    name: "Hybrid Cold Storage",
    category: CATEGORIES.INDUSTRIAL,
    price: 250,
    rating: 4.7,
    isNew: true,
    image: "/productimg/Hybrid Cold Storage.png",
    shortDescription: "Solar-powered hybrid cold storage solution.",
    description:
      "Supports solar, battery, grid, and DG power sources with precise temperature control.",
    specifications: {
      Temperature: "-40°C",
      Pricing: "₹250 per sq.ft",

      InsulatedWall: "120 mm PUF",
      TransportableWheel: "Yes",
      DigitalDisplay: "Yes",
      OperatingSystem: "Automatic Control System",
      AutoSwitch: "Available",
      InnerPartition: "Available",
      SubChamber: "Available",
    },
  },

  {
    id: 13,
    slug: "cooling-coil",
    name: "Cooling Coil",
    category: CATEGORIES.COMPONENTS,
    price: 300,
    rating: 4.4,
    isNew: false,
    image: "/productimg/Cooling Coil.png",
    shortDescription: "High-efficiency cooling coil for HVAC systems.",
    description:
      "Manufactured using copper pipes and aluminium fins for superior heat transfer.",
    specifications: {
      Pricing: "₹300 per running inch",

      PipeMaterial: "Copper",
      TinMaterial: "Aluminium",
      BodyMaterial: "Steel",
      Coating: "Bronze",
    },
  },

  {
    id: 14,
    slug: "condenser-coil",
    name: "Condenser Coil",
    category: CATEGORIES.COMPONENTS,
    price: 300,
    rating: 4.4,
    isNew: false,
    image: "/productimg/Condenser Coil.png",
    shortDescription: "Durable condenser coil for industrial cooling.",
    description:
      "Designed for high thermal efficiency and long operational life.",
    specifications: {
      Pricing: "₹300 per running inch",
    },
  },

  {
    id: 15,
    slug: "air-conditioner-outer-body",
    name: "Air Conditioner Outer Body",
    category: CATEGORIES.COMPONENTS,
    price: 6500,
    rating: 4.3,
    isNew: false,
    image: "/productimg/Air Conditioner Outer Body.png",
    shortDescription: "Durable AC outer body for OEM manufacturing.",
    description:
      "High-strength steel outer casing for air conditioners with corrosion-resistant coating.",
    specifications: {
      Material: "Steel",
      Usage: "OEM Manufacturing",
    },
  },

  /* ================= BATTERY & ELECTRONICS ================= */

  {
    id: 16,
    slug: "lfp-battery",
    name: "LFP Battery",
    category: CATEGORIES.BATTERY,
    price: 14000,
    rating: 4.8,
    isNew: true,
    image: "/productimg/LFP Battery.png",
    shortDescription: "Long-life LFP battery for EV and solar systems.",
    description:
      "High-safety lithium iron phosphate battery with long cycle life and stable performance.",
    specifications: {
      WithBMS: "₹14 per watt",
      WithoutBMS: "₹11 per watt",
      Bmc: "yes",
      Body: "yes",
      Chargers: "yes",
    },
  },

  {
    id: 17,
    slug: "bms",
    name: "BMS",
    category: CATEGORIES.ELECTRONICS,
    price: 0,
    rating: 4.6,
    isNew: true,
    image: "/productimg/BMS.png",
    shortDescription: "Battery Management System for LFP batteries.",
    description:
      "Protects batteries from overcharge, discharge, overheating, and imbalance.",
    specifications: {
      VoltageSupport: "Up to 60V",
    },
  },

  {
    id: 18,
    slug: "battery-charger",
    name: "Battery Charger",
    category: CATEGORIES.ELECTRONICS,
    price: 0,
    rating: 4.5,
    isNew: false,
    image: "/productimg/Battery Charger.png",
    shortDescription: "Adjustable charger for multiple battery capacities.",
    description:
      "Supports various current ratings with adjustable voltage control.",
    specifications: {
      CurrentOptions: "1A – 20A",
    },
  },

  {
    id: 19,
    slug: "pcb-and-soldering",
    name: "PCB and Soldering",
    category: CATEGORIES.SERVICES,
    price: 0,
    rating: 4.3,
    isNew: false,
    image: "/productimg/PCB and Soldering.png",
    shortDescription: "Professional PCB assembly and soldering services.",
    description:
      "Reliable PCB manufacturing, assembly, and soldering for industrial and electronic products.",
    specifications: {
      ServiceType: "PCB Assembly & Soldering",
    },
  },
];
