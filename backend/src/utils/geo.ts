/**
 * Calculates the great-circle distance between two points (latitude and longitude) 
 * using the Haversine formula.
 * 
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Mock mapping of Zambian regions to coordinates for USSD users without GPS.
 */
export const REGION_COORDINATES: Record<string, { lat: number, lng: number }> = {
    'Lusaka': { lat: -15.4167, lng: 28.2833 },
    'Chipata': { lat: -13.6390, lng: 32.6457 },
    'Livingstone': { lat: -17.8500, lng: 25.8500 },
    'Ndola': { lat: -12.9667, lng: 28.6333 },
    'Kasama': { lat: -10.2129, lng: 31.1808 },
    'Mongu': { lat: -15.2484, lng: 23.1274 }
};
