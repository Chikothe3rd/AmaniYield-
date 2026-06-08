import axios from 'axios';

/**
 * Weather service for AmaniYield.
 * Integrates with OpenWeatherMap for live precipitation and moisture data.
 */

export interface WeatherAdvice {
    advice: string;
    precipitation_forecast: string;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    temp?: number;
}

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'PLACEHOLDER_KEY';

// Region to Geo-Coordinates Mapping for Zambia
const COORDINATES: Record<string, { lat: number, lon: number }> = {
    'Lusaka': { lat: -15.4167, lon: 28.2833 },
    'Chipata': { lat: -13.6333, lon: 32.6500 },
    'Livingstone': { lat: -17.8500, lon: 25.8500 },
    'Ndola': { lat: -12.9667, lon: 28.6333 },
    'Kasama': { lat: -10.2129, lon: 31.1808 },
    'Mongu': { lat: -15.2484, lon: 23.1274 }
};

export async function getPlantingAdvice(region: string): Promise<WeatherAdvice> {
    const coords = COORDINATES[region] || COORDINATES['Lusaka'];
    
    try {
        // Fetch current weather and 5-day forecast
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                lat: coords.lat,
                lon: coords.lon,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        const weatherData = response.data;
        const rain = weatherData.rain ? (weatherData.rain['1h'] || 0) : 0;
        const temp = weatherData.main.temp;

        // Logic to determine risk and advice based on real data
        let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
        let advice = '';

        if (rain < 2 && temp > 30) {
            risk = 'HIGH';
            advice = 'Drought Warning: High heat and low rain detected. Delay planting and prioritize mulching.';
        } else if (rain >= 2 && rain < 10) {
            risk = 'MEDIUM';
            advice = 'Moderate Conditions: Suitable for resilient varieties. Monitor soil moisture closely.';
        } else {
            risk = 'LOW';
            advice = 'Optimal Conditions: Good rainfall and temperature for Maize and Soya. Proceed with fertilizer.';
        }

        return {
            precipitation_forecast: `${rain}mm (Last Hour)`,
            risk_level: risk,
            advice,
            temp
        };

    } catch (error) {
        console.error('Weather API Error:', error);
        // Fallback to static data if API fails or key is missing
        return {
            precipitation_forecast: 'Data Unavailable (Fallback Active)',
            risk_level: 'MEDIUM',
            advice: 'Reliability Protocol: Connection to satellite weather is limited. Stick to traditional planting cycles for your region.'
        };
    }
}

