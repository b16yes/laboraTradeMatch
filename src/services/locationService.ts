import { LocationCoordinates } from '../types/models';

export class LocationService {
  /**
   * Calculate distance between two lat/lng coordinates in kilometers (Haversine formula)
   */
  static calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(coord2.latitude - coord1.latitude);
    const dLon = this.deg2rad(coord2.longitude - coord1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.latitude)) *
        Math.cos(this.deg2rad(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Convert lat/long deltas to relative X/Y pixel offsets on radar canvas view
   */
  static getRadarCoordinates(center: LocationCoordinates, target: LocationCoordinates, radiusKm: number) {
    const maxPixelRadius = 130;
    const distance = this.calculateDistance(center, target);

    if (distance > radiusKm) {
      return null;
    }

    const angleRad = Math.atan2(target.latitude - center.latitude, target.longitude - center.longitude);
    const ratio = distance / radiusKm;

    const x = Math.cos(angleRad) * maxPixelRadius * ratio;
    const y = -Math.sin(angleRad) * maxPixelRadius * ratio;

    return { x, y, distance };
  }
}
