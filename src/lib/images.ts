// Curated healthcare imagery (Unsplash). Used as design fallbacks when the CMS
// has no image set. Replace via the Media Library / CMS at any time.

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const HEALTHCARE_IMAGES = {
  doctorTablet: u("1576091160550-2173dba999ef"),
  medicalTeam: u("1631815588090-d4bfec5b1ccb"),
  nurse: u("1559839734-2b71ea197ec2"),
  hospitalCorridor: u("1586773860418-d37222d8fce3"),
  consultation: u("1622253692010-333f2da6031d"),
  lab: u("1582719478250-c89cae4dc85b"),
  pharmacy: u("1576602976047-174e57a47881"),
  dataAnalytics: u("1551288049-bebda4e38f71"),
  surgeon: u("1612349317150-e413f6a5b16d"),
  patientCare: u("1584515933487-779824d29309"),
  reception: u("1666214280557-f1b5022eb634"),
  africanDoctor: u("1594824476967-48c8b964273f"),
  africanNurse: u("1567013127542-490d757e51fc"),
  community: u("1542884748-2b87b36c6b90"),
} as const;

export const PARTNER_LOGOS = [
  "Ministry of Health",
  "AKU Hospital",
  "Nairobi Health",
  "Coastal Medical",
  "Zanzibar Care",
] as const;
