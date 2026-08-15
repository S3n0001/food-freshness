/** String-literal union kept as a const object (not `enum`) for esbuild-friendly erasure. */
export const FoodType = {
  MILK: "MILK",
  MEAT: "MEAT",
  FRUIT: "FRUIT",
  VEGETABLE: "VEGETABLE",
} as const;

export type FoodType = (typeof FoodType)[keyof typeof FoodType];

/** Mirrors `getFoodName()` — the button is labeled VEG, the LCD/serial print VEGETABLE. */
export function getFoodName(food: FoodType): string {
  switch (food) {
    case FoodType.MILK:
      return "MILK";
    case FoodType.MEAT:
      return "MEAT";
    case FoodType.FRUIT:
      return "FRUIT";
    default:
      return "VEGETABLE";
  }
}

export interface FoodButtonDef {
  food: FoodType;
  label: string;
  pin: string;
}

/** Mirrors the four physical buttons wired to BUTTON_MILK / BUTTON_MEAT / BUTTON_FRUIT / BUTTON_VEG. */
export const FOOD_BUTTONS: FoodButtonDef[] = [
  { food: FoodType.MILK, label: "MILK", pin: "D11" },
  { food: FoodType.MEAT, label: "MEAT", pin: "D12" },
  { food: FoodType.FRUIT, label: "FRUIT", pin: "A1" },
  { food: FoodType.VEGETABLE, label: "VEG", pin: "A2" },
];
