import type { PeripheralItem } from "../types";

export const peripherals: PeripheralItem[] = [
  // ─── Keyboards ────────────────────────────────────────────────
  {
    id: "keychron-v1",
    category: "keyboard",
    name: "Keychron V1 QMK/VIA Mechanical",
    price: 84,
    brand: "Keychron",
    iconName: "Keyboard",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Keychron+V1", price: 84 },
      { store: "Keychron.com", url: "https://www.keychron.com/products/keychron-v1", price: 84 },
    ],
  },
  {
    id: "rk-r75",
    category: "keyboard",
    name: "Royal Kludge RK84 Pro Tri-Mode",
    price: 60,
    brand: "Royal Kludge",
    iconName: "Keyboard",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Royal+Kludge+RK84", price: 60 },
    ],
  },
  {
    id: "logitech-mx-keys",
    category: "keyboard",
    name: "Logitech MX Keys S Wireless",
    price: 109,
    brand: "Logitech",
    iconName: "Keyboard",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Logitech+MX+Keys+S", price: 109 },
    ],
  },

  // ─── Mice ─────────────────────────────────────────────────────
  {
    id: "logitech-g502x",
    category: "mouse",
    name: "Logitech G502 X PLUS LIGHTSPEED",
    price: 139,
    brand: "Logitech",
    iconName: "Mouse",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Logitech+G502+X+Plus", price: 139 },
    ],
  },
  {
    id: "razer-viper-v3",
    category: "mouse",
    name: "Razer Viper V3 HyperSpeed",
    price: 99,
    brand: "Razer",
    iconName: "Mouse",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Razer+Viper+V3", price: 99 },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=Razer+Viper+V3", price: 105 },
    ],
  },
  {
    id: "logitech-mx-master",
    category: "mouse",
    name: "Logitech MX Master 3S Wireless",
    price: 99,
    brand: "Logitech",
    iconName: "Mouse",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Logitech+MX+Master+3S", price: 99 },
    ],
  },

  // ─── Monitors ─────────────────────────────────────────────────
  {
    id: "lg-27gp850",
    category: "monitor",
    name: 'LG UltraGear 27GP850-B 27" 165Hz Nano IPS',
    price: 299,
    brand: "LG",
    iconName: "Monitor",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=LG+27GP850", price: 299 },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=LG+UltraGear+27GP850", price: 310 },
    ],
  },
  {
    id: "samsung-odyssey-g7",
    category: "monitor",
    name: 'Samsung Odyssey G7 32" 240Hz Curved QHD',
    price: 449,
    brand: "Samsung",
    iconName: "Monitor",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Samsung+Odyssey+G7+32", price: 449 },
    ],
  },
  {
    id: "dell-s2722qc",
    category: "monitor",
    name: 'Dell S2722QC 27" 4K UHD USB-C',
    price: 279,
    brand: "Dell",
    iconName: "Monitor",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Dell+S2722QC", price: 279 },
    ],
  },

  // ─── Audio ────────────────────────────────────────────────────
  {
    id: "sony-wh1000xm5",
    category: "audio",
    name: "Sony WH-1000XM5 Wireless ANC",
    price: 298,
    brand: "Sony",
    iconName: "Headphones",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Sony+WH-1000XM5", price: 298 },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=Sony+WH-1000XM5", price: 310 },
    ],
  },
  {
    id: "at-m50xbt2",
    category: "audio",
    name: "Audio-Technica ATH-M50xBT2 Wireless",
    price: 199,
    brand: "Audio-Technica",
    iconName: "Headphones",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Audio+Technica+M50xBT2", price: 199 },
    ],
  },
  {
    id: "hyperx-cloud-iii",
    category: "audio",
    name: "HyperX Cloud III Wireless Gaming",
    price: 169,
    brand: "HyperX",
    iconName: "Headphones",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=HyperX+Cloud+III+Wireless", price: 169 },
    ],
  },

  // ─── Controllers ──────────────────────────────────────────────
  {
    id: "dualsense-edge",
    category: "controller",
    name: "Sony DualSense Edge Wireless",
    price: 199,
    brand: "Sony",
    iconName: "Gamepad2",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=DualSense+Edge", price: 199 },
    ],
  },
  {
    id: "xbox-elite-2",
    category: "controller",
    name: "Xbox Elite Wireless Controller Series 2",
    price: 129,
    brand: "Xbox",
    iconName: "Gamepad2",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=Xbox+Elite+Controller+Series+2", price: 129 },
      { store: "Flipkart", url: "https://www.flipkart.com/search?q=Xbox+Elite+Controller", price: 135 },
    ],
  },
  {
    id: "8bitdo-ultimate",
    category: "controller",
    name: '8BitDo Ultimate Bluetooth with Charging Dock',
    price: 69,
    brand: "8BitDo",
    iconName: "Gamepad2",
    buyLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=8BitDo+Ultimate+Bluetooth", price: 69 },
    ],
  },
];
