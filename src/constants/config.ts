export const BRAND = {
  name: 'MSpace',
  version: '1.0',
  owner: 'Clyde A',
  studio: 'lightants',
  socialHandle: 'mspacemind',
  facebookUrl: 'https://www.facebook.com/mspacemind',
  instagramUrl: 'https://www.instagram.com/mspacemind',
  mapsSearchQuery: 'MSpace Mlang Aqua Verde',
  /** Leave empty — do not invent a Google Place ID */
  GOOGLE_MAPS_PLACE_URL: '',
};

export const LOCATION = {
  name: 'MSpace Mlang',
  address: "2nd Floor Aqua Verde Commercial Building, M'lang, North Cotabato",
  hours: '9:00–18:00',
  openHour: 9,
  closeHour: 18,
};

export const PRICING = {
  walkInPerHour: 50,
  memberPerHour: 45,
  memberDiscountLabel: '10% off',
};

export const BOOKING = {
  minHours: 1,
  maxHours: 8,
  startHourMin: 9,
  startHourMax: 17,
};

export const STORAGE_KEYS = {
  membership: '@mspace/membership',
  bookings: '@mspace/bookings',
  pushToken: '@mspace/pushToken',
};
