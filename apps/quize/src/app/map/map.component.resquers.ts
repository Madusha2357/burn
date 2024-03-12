export const RESQUERS: Resquer[] = [
  {
    name: 'Location 1',
    longitude: 80.4037,
    latitude: 8.3114,
    details: 'Details for Location 1',
  },
  {
    name: 'Location 2',
    latitude: 7.2906,
    longitude: 80.6337,
    details: 'Details for Location 2',
  },
  {
    name: 'Location 3',
    latitude: 6.7056,
    longitude: 80.3847,
    details: 'Details for Location 3',
  },
];

export interface Resquer {
  name: string;
  latitude: number;
  longitude: number;
  details: string;
}
