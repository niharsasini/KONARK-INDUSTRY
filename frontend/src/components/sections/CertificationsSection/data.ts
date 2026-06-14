export interface Cert {
  id: number;
  title: string;
  issuer: string;
  subtitle: string;
  number: string;
  valid: string;
  tag: string;
  color: string;
  iconText: string;
  badge: string;
  driveLink: string;
  embedUrl: string;
}

export const certs: Cert[] = [
  {
    id: 1,
    title: 'Startup India',
    issuer: 'Ministry of Commerce & Industry',
    subtitle: 'Dept. for Promotion of Industry & Internal Trade',
    number: 'Cert No: DIPP182913',
    valid: 'Valid till December 2032',
    tag: 'Government of India ✓',
    color: '#FF9933',
    iconText: 'SI',
    badge: 'DIPP RECOGNISED',
    driveLink: 'https://drive.google.com/file/d/1KXTqXjShczsEB4VQh5bNHgMrqwVIKT2S/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1KXTqXjShczsEB4VQh5bNHgMrqwVIKT2S/preview',
  },
  {
    id: 2,
    title: 'Startup Odisha',
    issuer: 'Govt. of Odisha — MSME Dept.',
    subtitle: 'Odisha Startup Policy 2016',
    number: 'Reg No: OSP/SP/02193',
    valid: 'Issued April 2025',
    tag: 'Government of Odisha ✓',
    color: '#00d4ff',
    iconText: 'SO',
    badge: 'STATE RECOGNISED',
    driveLink: 'https://drive.google.com/file/d/1cGzOUQD_izwzAO0aEh3Oolkp8YVF_1Rx/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1cGzOUQD_izwzAO0aEh3Oolkp8YVF_1Rx/preview',
  },
  {
    id: 3,
    title: 'Udyam MSME Registration',
    issuer: 'Ministry of MSME, Govt. of India',
    subtitle: 'Manufacturing — Motor Vehicles',
    number: 'UDYAM-OD-19-0064755',
    valid: 'Registered January 2024',
    tag: 'Government of India ✓',
    color: '#7c3aed',
    iconText: 'MSME',
    badge: 'MSME REGISTERED',
    driveLink: 'https://drive.google.com/file/d/1dSzfTJV_iwTU4ZVvcd-UFB59t7KwVt50/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1dSzfTJV_iwTU4ZVvcd-UFB59t7KwVt50/preview',
  },
  {
    id: 4,
    title: 'Importer-Exporter Code',
    issuer: 'Directorate General of Foreign Trade',
    subtitle: 'Ministry of Commerce & Industry',
    number: 'IEC: ABBFK1614L',
    valid: 'Issued November 2024',
    tag: 'DGFT Approved ✓',
    color: '#f97316',
    iconText: 'IEC',
    badge: 'EXPORT CERTIFIED',
    driveLink: 'https://drive.google.com/file/d/1iSr8CKXbYpp0IIToj9xPEkJ45Rzga08p/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1iSr8CKXbYpp0IIToj9xPEkJ45Rzga08p/preview',
  },
  {
    id: 5,
    title: 'Trade Mark Registration',
    issuer: 'Trade Marks Registry, Mumbai',
    subtitle: 'Class 9 — TV Sets & Electronics',
    number: 'TM No: 5527539',
    valid: 'Registered 13 July 2022',
    tag: 'IP India · Govt. of India ✓',
    color: '#ec4899',
    iconText: 'TM',
    badge: 'TRADE MARK REGISTERED',
    driveLink: 'https://drive.google.com/file/d/1gBi-o7MYoX3R82_SJ3N2lPpPGrnbnnZz/view?usp=drive_link',
    embedUrl: 'https://drive.google.com/file/d/1gBi-o7MYoX3R82_SJ3N2lPpPGrnbnnZz/preview',
  },
]
