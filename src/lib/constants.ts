/**
 * Timing + threshold constants mirrored 1:1 from the FOOD GUARDIAN firmware
 * (Food_Guardian.ino). Keep these in sync with the sketch if it changes —
 * every value below has a matching `#define` or `const unsigned long` there.
 */

export const SENSOR_INTERVAL_MS = 2000; // SENSOR_INTERVAL
export const LCD_INTERVAL_MS = 3000; // LCD_INTERVAL
export const BUTTON_DELAY_MS = 300; // BUTTON_DELAY
export const FOOD_SELECTED_SPLASH_MS = 1000; // delay(1000) inside showFoodSelection()

export const BUZZER_WARNING_INTERVAL_MS = 3000; // HIGH RISK beep spacing
export const BUZZER_CRITICAL_INTERVAL_MS = 1000; // CRITICAL beep spacing
export const BUZZER_WARNING_TONE_HZ = 2000;
export const BUZZER_WARNING_TONE_MS = 300;
export const BUZZER_CRITICAL_TONE_HZ = 2500;
export const BUZZER_CRITICAL_TONE_MS = 500;

export const RISK_SAFE_MAX = 25;
export const RISK_WARNING_MAX = 50;
export const RISK_HIGH_MAX = 75;
