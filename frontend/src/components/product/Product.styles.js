/* ================= HERO ================= */
export const heroTitle = `
  text-4xl md:text-5xl lg:text-6xl
  font-extrabold mb-6
`;

export const heroSubtitle = `
  text-lg md:text-xl
  text-gray-300 mb-8
  max-w-2xl
`;

/* ================= CARD ================= */
export const cardStyles = `
  bg-white rounded-xl
  shadow-md
  overflow-hidden
`;

/* ================= PAPER FOLD ================= */
export const foldedCorner = `
  absolute top-0 left-0 w-0 h-0
  border-t-[48px] border-t-yellow-500
  border-r-[48px] border-r-transparent
  z-20
`;

export const foldedCornerText = `
  absolute top-[6px] left-[6px]
  text-white text-xs font-bold
  rotate-[-45deg]
  origin-left z-30
`;

/* ================= IMAGE ================= */
export const productImageWrapper = `
  relative w-full h-56
  overflow-hidden
  bg-gray-100
`;

export const productImage = `
  w-full h-full
  object-cover
`;

/* ================= TEXT ================= */
export const productTitle = `
  text-lg font-semibold text-gray-900 mb-1
`;

export const productDescription = `
  text-sm text-gray-600
`;

/* ================= PRICE ================= */
export const priceTag = `
  text-yellow-600 font-bold text-sm
`;

/* ================= BUTTON (ONLY HOVER HERE) ================= */
export const viewButton = `
  bg-gray-900 text-white text-xs
  px-4 py-2 rounded-md
  transition-colors duration-200
  hover:bg-yellow-500 hover:text-gray-900
`;

/* ================= CATEGORY FILTER BUTTON ================= */
export const categoryButton = `
  px-5 py-2 rounded-full
  border border-gray-300
  text-sm font-medium text-gray-700
  transition-all duration-200
  hover:bg-yellow-500 hover:text-gray-900 hover:border-yellow-500
`;
