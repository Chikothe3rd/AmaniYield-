"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geo_1 = require("./geo");
describe('Geospatial Routing Utility', () => {
    test('Calculates distance correctly between Lusaka and Chipata', () => {
        // Approx distance between Lusaka (-15.4167, 28.2833) and Chipata (-13.6390, 32.6457) is ~510km
        const dist = (0, geo_1.calculateDistance)(-15.4167, 28.2833, -13.6390, 32.6457);
        expect(dist).toBeGreaterThan(500);
        expect(dist).toBeLessThan(520);
    });
    test('Distance to same point is zero', () => {
        const dist = (0, geo_1.calculateDistance)(-15.4167, 28.2833, -15.4167, 28.2833);
        expect(dist).toBe(0);
    });
});
