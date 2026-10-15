// Collections barrel - all products organized by category
export { BRIDAL_POSHAKS } from "./bridal";
export { FESTIVE_POSHAKS } from "./festive";
export { CLASSIC_POSHAKS } from "./classic";
export { JEWELLERY_POSHAKS } from "./jewellery";

import { BRIDAL_POSHAKS } from "./bridal";
import { FESTIVE_POSHAKS } from "./festive";
import { CLASSIC_POSHAKS } from "./classic";
import { JEWELLERY_POSHAKS } from "./jewellery";
import type { PoshakProduct } from "../products";

// Combined array matching original REAL_POSHAKS order
export const ALL_COLLECTION_PRODUCTS: PoshakProduct[] = [
  ...BRIDAL_POSHAKS,
  ...FESTIVE_POSHAKS,
  ...CLASSIC_POSHAKS,
  ...JEWELLERY_POSHAKS,
];