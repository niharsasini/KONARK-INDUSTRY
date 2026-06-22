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
    type: "vehicle",
    category: CATEGORIES.EV,
    price: 27000,
    rating: 4.6,
    isNew: true,
    image: "/productimg/Electric Scooter.png",
    images: [
      "/productimg/Electric Scooter.png",
      "/productimg/Electric Scooter.png",
    ],
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
    type: "vehicle",
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
    type: "vehicle",
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
    type: "vehicle",
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
      Payload: "Up to 500kg",
      Range: "Up to 80km per charge",
      Motor: "2000W BLDC",
      Battery: "48V 100Ah LFP",
      MaxSpeed: "25 km/h",
      ChargingTime: "6-8 hours",
      Usage: "Industrial Transport",
      Customization: "Available",
    },
  },

  {
    id: 27,
    slug: "electric-bike",
    name: "Electric Bike",
    type: "vehicle",
    category: CATEGORIES.EV,
    price: 32000,
    rating: 4.5,
    isNew: true,
    image: "/konark/bike.png",
    shortDescription:
      "Lightweight electric bike for daily commuting with removable battery.",
    description:
      "The Konark Electric Bike combines style with efficiency. Designed for city commuters, it features a lightweight aluminium frame, removable lithium battery, and regenerative braking. Perfect for college students and office-goers.",
    specifications: {
      Motor: "250W BLDC Hub Motor",
      Range: "Up to 60km per charge",
      MaxSpeed: "25 km/h",
      Battery: "36V 10Ah Lithium",
      ChargingTime: "3-4 hours",
      Frame: "Aluminium alloy",
      Brakes: "Disc front, V-brake rear",
      Weight: "18 kg",
    },
  },

  /* ================= HOME APPLIANCES ================= */

  {
    id: 5,
    slug: "air-conditioner",
    name: "Air Conditioner",
    type: "product",
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
      EnergyRating: "3 Star / 5 Star BEE",
      NoiseLevel: "<40 dB (indoor unit)",
      Warranty: "1 year comprehensive, 5 year compressor",
      CoolingArea: "Up to 150 sq.ft (1.5 ton)",
    },
  },

  {
    id: 6,
    slug: "bldc-fan",
    name: "BLDC Fan",
    type: "product",
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
    type: "product",
    category: CATEGORIES.HOME,
    price: 6500,
    rating: 4.5,
    isNew: false,
    image: "/productimg/BLDC Motor .png",
    shortDescription: "High-efficiency BLDC motor for EV and industrial use.",
    description:
      "Made-in-India(odisha) BLDC motor available in multiple power ratings for electric vehicles and automation systems.",
    specifications: {
      PowerRating: "250W - 5000W",
      Voltage: "24V / 48V / 72V",
      RPM: "300 - 3000 RPM",
      Efficiency: ">85%",
      Cooling: "Air cooled",
      Applications: "EV, Industrial, Agriculture",
    },
  },

  {
    id: 8,
    slug: "induction-cooker",
    name: "Induction Cooker",
    type: "product",
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
      HeatingTechnology: "Electromagnetic induction",
      Safety: "Auto shut-off, child lock",
      Cookware: "Iron, steel, cast iron compatible",
    },
  },

  {
    id: 9,
    slug: "infra-red-cooker",
    name: "Infra Red Cooker",
    type: "product",
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
      HeatingTechnology: "Infrared radiation",
      Surface: "Crystal glass top",
      Cookware: "All cookware compatible",
    },
  },

  {
    id: 10,
    slug: "water-purifier",
    name: "Water Purifier",
    type: "product",
    category: CATEGORIES.HOME,
    price: 4800,
    rating: 4.4,
    isNew: false,
    image: "/productimg/Water Purifier.png",
    shortDescription: "Multi-stage RO water purifier for clean drinking water.",
    description:
      "Effectively removes impurities and improves taste, ensuring safe water for households.",
    specifications: {
      Purification: "RO + UV + UF",
      Capacity: "10 litres/hour",
      TDSReduction: "Up to 2000 ppm",
      StorageTank: "7 litres",
      Power: "36W",
      Warranty: "1 year comprehensive",
    },
  },

  {
    id: 11,
    slug: "android-tv",
    name: "Android TV",
    type: "product",
    category: CATEGORIES.HOME,
    price: 0,
    rating: 4.5,
    isNew: true,
    image: "/productimg/Android TV.png",
    shortDescription: "Smart Android TV with 4K display. Price varies by screen size — contact us for a quote.",
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
    type: "product",
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
    type: "product",
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
      Compatible: "All split AC brands",
      CapacityRange: "1 ton to 5 ton",
      Warranty: "6 months",
      Availability: "In stock for major brands",
    },
  },

  {
    id: 14,
    slug: "condenser-coil",
    name: "Condenser Coil",
    type: "product",
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
      Compatible: "All split AC brands",
      CapacityRange: "1 ton to 5 ton",
      Material: "Copper / Aluminium",
      Warranty: "6 months",
      Availability: "In stock for major brands",
    },
  },

  {
    id: 15,
    slug: "air-conditioner-outer-body",
    name: "Air Conditioner Outer Body",
    type: "product",
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
      Compatible: "All split AC brands",
      CapacityRange: "1 ton to 5 ton",
      Warranty: "6 months",
      Availability: "In stock for major brands",
    },
  },

  /* ================= BATTERY & ELECTRONICS ================= */

  {
    id: 16,
    slug: "lfp-battery",
    name: "LFP Battery",
    type: "product",
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
    type: "product",
    category: CATEGORIES.ELECTRONICS,
    price: 0,
    rating: 4.6,
    isNew: true,
    image: "/productimg/BMS.png",
    shortDescription: "Battery Management System for LFP batteries. Price on request — contact for bulk pricing.",
    description:
      "Protects batteries from overcharge, discharge, overheating, and imbalance.",
    specifications: {
      VoltageRange: "24V - 96V",
      CurrentRating: "Up to 200A",
      CellChemistry: "LFP / NMC / LTO",
      Protection: "Overcharge, Over-discharge, Short circuit",
      Communication: "UART / CAN Bus",
      OperatingTemp: "-20°C to 60°C",
    },
  },

  {
    id: 18,
    slug: "battery-charger",
    name: "Battery Charger",
    type: "product",
    category: CATEGORIES.ELECTRONICS,
    price: 0,
    rating: 4.5,
    isNew: false,
    image: "/productimg/Battery Charger.png",
    shortDescription: "Adjustable charger for multiple battery capacities. Price varies by output — contact for pricing.",
    description:
      "Supports various current ratings with adjustable voltage control.",
    specifications: {
      InputVoltage: "180-260V AC",
      OutputVoltage: "48V / 60V / 72V",
      ChargingCurrent: "10A / 20A / 30A",
      Efficiency: ">92%",
      Protection: "Short circuit, Over voltage",
      Connector: "Anderson / XT60",
    },
  },

  {
    id: 28,
    slug: "solar-inverter",
    name: "Solar Inverter",
    type: "product",
    category: CATEGORIES.ELECTRONICS,
    price: 8500,
    rating: 4.6,
    isNew: false,
    image: "/konark/solarpannel solutions.png",
    shortDescription:
      "Pure sine wave solar inverter for home and commercial solar systems.",
    description:
      "High-efficiency pure sine wave inverter designed for rooftop and ground-mount solar power systems. Compatible with all major solar panel brands. Built-in MPPT charge controller, LCD display, and overload protection.",
    specifications: {
      Type: "Pure Sine Wave",
      Capacity: "1kVA to 10kVA",
      InputVoltage: "12V / 24V / 48V DC",
      OutputVoltage: "230V AC",
      Efficiency: ">93%",
      MPPT: "Built-in charge controller",
      Display: "LCD with battery/load status",
      Protection: "Overload, short circuit, overheat",
    },
  },

  {
    id: 19,
    slug: "pcb-and-soldering",
    name: "PCB and Soldering",
    type: "service",
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
      Services: "PCB repair, component replacement",
      Equipment: "AC PCB, washing machine PCB, TV board",
      Turnaround: "24-48 hours",
      Warranty: "3 months on repair",
      OnSite: "Available for bulk orders",
    },
  },

  /* ================= SERVICES (additional) ================= */

  {
    id: 20,
    slug: "ac-repair-service",
    name: "AC Repair & Service",
    type: "service",
    category: CATEGORIES.SERVICES,
    price: 0,
    rating: 4.7,
    isNew: false,
    image: "/konark/ac.png",
    shortDescription:
      "Expert AC repair for all brands. Same-day service across Bhubaneswar.",
    description:
      "Our certified technicians handle all AC brands — split, window, cassette. Diagnosis, gas refill, PCB repair, and deep cleaning, backed by a 90-day service warranty.",
    specifications: {
      ResponseTime: "Within 2 hours",
      Warranty: "90 days on service",
      BrandsCovered: "All brands",
      ServiceArea: "Bhubaneswar, Cuttack, Puri",
      Availability: "Mon-Sat 8AM-8PM",
    },
  },

  {
    id: 21,
    slug: "ev-charging-station-installation",
    name: "EV Charging Station Installation",
    type: "service",
    category: CATEGORIES.SERVICES,
    price: 0,
    rating: 4.8,
    isNew: false,
    image: "/konark/evcharge solution.png",
    shortDescription:
      "Install home and commercial EV charging stations. Certified installation.",
    description:
      "Complete EV charging station setup for homes, offices, and commercial spaces. AC and DC fast chargers, fully approved installation with all electrical work included.",
    specifications: {
      ChargerTypes: "AC 3.3kW / 7.4kW / DC 15kW+",
      InstallationTime: "1-2 days",
      Warranty: "1 year on installation",
      ServiceArea: "Odisha statewide",
    },
    externalLink: "https://www.soumyashipower.in/",
  },

  {
    id: 22,
    slug: "solar-power-plant-installation",
    name: "Solar Power Plant Installation",
    type: "service",
    category: CATEGORIES.SERVICES,
    price: 0,
    rating: 4.9,
    isNew: false,
    image: "/konark/solarpannel solutions.png",
    shortDescription:
      "Residential and commercial solar power plants. Rooftop to utility scale.",
    description:
      "Complete solar power plant installation from design to commissioning. Grid-tied, off-grid, and hybrid systems, with government subsidy assistance and a 25-year panel warranty.",
    specifications: {
      CapacityRange: "1kW to 1MW+",
      SystemTypes: "Grid-tied / Off-grid / Hybrid",
      PanelWarranty: "25 years",
      ROIPeriod: "3-5 years",
    },
    externalLink: "https://www.soumyashipower.in/",
  },

  {
    id: 23,
    slug: "wind-power-plant-installation",
    name: "Wind Power Plant Installation",
    type: "service",
    category: CATEGORIES.SERVICES,
    price: 0,
    rating: 4.7,
    isNew: true,
    image: "/konark/productenergystored.png",
    shortDescription:
      "Small and large-scale wind energy solutions for farms and industries.",
    description:
      "Wind power plant installation for agricultural, industrial, and institutional use, with hybrid wind-solar systems available and complete civil and electrical work.",
    specifications: {
      CapacityRange: "1kW to 500kW",
      Types: "Horizontal / Vertical axis",
      Hybrid: "Wind + Solar available",
      ServiceArea: "Eastern India",
    },
    externalLink: "https://www.soumyashipower.in/",
  },

  {
    id: 24,
    slug: "battery-swap-service",
    name: "Battery Swap Service",
    type: "service",
    category: CATEGORIES.SERVICES,
    price: 150,
    rating: 4.8,
    isNew: false,
    image: "/konark/productevbatterie.png",
    shortDescription:
      "Exchange your discharged EV battery for a fully charged one. Home pickup available.",
    description:
      "Hand us your discharged LFP or lead-acid EV battery and drive away with a fully charged replacement. Home pickup available across Bhubaneswar with real-time token tracking.",
    specifications: {
      SwapFee: "From ₹150",
      Turnaround: "Same day",
      BatteryTypes: "LFP / Lead Acid / NMC",
      Pickup: "Home pickup available",
      Tracking: "Real-time token tracking",
    },
    internalLink: "/battery-swap",
  },

  /* ================= EV CARS (upcoming) ================= */

  {
    id: 25,
    slug: "konark-ev-car-x1",
    name: "Konark EV Car X1",
    type: "vehicle",
    category: CATEGORIES.EV,
    price: 0,
    rating: 0,
    isNew: true,
    isUpcoming: true,
    image: "/konark/car-1 (1).png",
    shortDescription:
      "Upcoming electric car from Konark Industry. Register your interest today.",
    description:
      "The Konark EV Car X1 is our upcoming electric sedan designed for Indian roads. Spacious 5-seater, 300+ km range, with fast charging support. Expected launch 2025-26.",
    specifications: {
      Status: "Upcoming",
      ExpectedLaunch: "2025-26",
      Range: "300+ km (estimated)",
      Seating: "5 passengers",
      Charging: "AC + DC fast charge",
      Motor: "Permanent Magnet Synchronous",
    },
  },

  {
    id: 26,
    slug: "konark-ev-car-x2",
    name: "Konark EV Car X2",
    type: "vehicle",
    category: CATEGORIES.EV,
    price: 0,
    rating: 0,
    isNew: true,
    isUpcoming: true,
    image: "/konark/car-2.png",
    shortDescription: "Upcoming electric SUV. Designed for Odisha terrain.",
    description:
      "The Konark EV Car X2 SUV is built for both city roads and Odisha terrain. 7-seater capacity with high ground clearance for rural roads and an estimated 280km range.",
    specifications: {
      Status: "Upcoming",
      Type: "Electric SUV",
      Seating: "7 passengers",
      Range: "280 km (estimated)",
      GroundClearance: "High clearance",
    },
  },

  /* ================= INDUSTRIAL EQUIPMENT ================= */

  {
    id: 29,
    slug: "industrial-floor-sweeper-vol-2300",
    name: "Industrial Floor Sweeper VOL-2300",
    type: "vehicle",
    category: CATEGORIES.INDUSTRIAL,
    price: 1440000,
    rating: 4.8,
    isNew: true,
    // TODO: Replace with real sweeper image via admin
    image: "/productimg/Utility Vehicle.png",
    images: ["/productimg/Utility Vehicle.png"],
    shortDescription:
      "Heavy-duty electric floor sweeper for industrial and municipal cleaning. 22,000 m²/h efficiency.",
    description:
      "The Konark Industry VOL-2300 Industrial Floor Sweeper is a powerful battery-operated cleaning machine designed for large industrial and municipal areas. Features sweep and suction combo, HD reversing camera, industrial grade dust filtration, and water spray dust suppression system. Ideal for warehouses, factory premises, industrial parks, roads and municipal cleaning.",
    specifications: {
      Model: "VOL-2300",
      ProductSize: "3200 × 2100 × 2950 mm",
      SweepingWidth: "2000 - 2200 mm",
      MainBrushWidth: "800 mm",
      SideBrushWidth: "550 mm",
      DustTankCapacity: "260 L",
      WaterTankCapacity: "300 L",
      MachineWeight: "1580 kg",
      Battery: "48V / 200Ah",
      DriveMotor: "3000W",
      BrushMotor: "1000W",
      WorkingTime: "6 - 8 hours",
      WorkingEfficiency: "22,000 m²/h",
      TravelSpeed: "12 - 16 km/h",
      AirFilter: "Industrial Grade Dust Filter",
    },
  },
];
