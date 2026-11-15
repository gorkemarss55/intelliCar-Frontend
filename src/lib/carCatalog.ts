
export const CAR_CATALOG: Record<string, string[]> = {
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5'],
  BMW: ['1 Serisi', '2 Serisi', '3 Serisi', '4 Serisi', '5 Serisi', 'X1', 'X3', 'X5', 'i4'],
  Citroen: ['Berlingo', 'C-Elysee', 'C3', 'C4', 'C5 Aircross'],
  Cupra: ['Formentor', 'Leon'],
  Dacia: ['Duster', 'Jogger', 'Lodgy', 'Sandero', 'Sandero Stepway'],
  Fiat: ['500', 'Doblo', 'Egea', 'Egea Cross', 'Fiorino', 'Linea', 'Panda'],
  Ford: ['Courier', 'Fiesta', 'Focus', 'Kuga', 'Mondeo', 'Puma'],
  Honda: ['City', 'Civic', 'CR-V', 'HR-V', 'Jazz'],
  Hyundai: ['Bayon', 'Elantra', 'i10', 'i20', 'i30', 'Kona', 'Tucson'],
  Jeep: ['Avenger', 'Compass', 'Renegade'],
  Kia: ['Ceed', 'Niro', 'Picanto', 'Rio', 'Sorento', 'Sportage', 'Stonic'],
  'Land Rover': ['Defender', 'Discovery Sport', 'Range Rover Evoque'],
  Mazda: ['2', '3', '6', 'CX-3', 'CX-5'],
  'Mercedes-Benz': ['A 180', 'A 200', 'C 180', 'C 200', 'CLA', 'E 200', 'GLA', 'GLC'],
  Mini: ['Cooper', 'Countryman'],
  Mitsubishi: ['ASX', 'L200', 'Outlander'],
  Nissan: ['Juke', 'Micra', 'Qashqai', 'X-Trail'],
  Opel: ['Astra', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Mokka'],
  Peugeot: ['2008', '208', '301', '308', '3008', '5008', 'Rifter'],
  Renault: ['Austral', 'Captur', 'Clio', 'Fluence', 'Kadjar', 'Megane', 'Symbol', 'Taliant'],
  Seat: ['Arona', 'Ibiza', 'Leon'],
  Skoda: ['Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Scala', 'Superb'],
  Suzuki: ['Swift', 'SX4 S-Cross', 'Vitara'],
  Tesla: ['Model 3', 'Model Y'],
  Toyota: ['C-HR', 'Corolla', 'Corolla Cross', 'Hilux', 'RAV4', 'Yaris'],
  Volkswagen: ['Arteon', 'Caddy', 'Golf', 'Passat', 'Polo', 'T-Roc', 'Taigo', 'Tiguan'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
}

export const CAR_BRANDS = Object.keys(CAR_CATALOG).sort((a, b) => a.localeCompare(b, 'tr'))
export const getModels = (brand: string): string[] => CAR_CATALOG[brand] ?? []
