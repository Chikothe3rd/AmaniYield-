"use strict";
// Using native fetch in Node 18+
const BASE_URL = 'http://localhost:5000';
async function runTests() {
    console.log('🚀 Starting Phase 1 API Verification...\n');
    try {
        // 1. Health Check
        console.log('🧪 1. Testing GET /health');
        const healthRes = await fetch(`${BASE_URL}/health`);
        console.log(`Status: ${healthRes.status}`);
        console.log(`Response:`, await healthRes.json(), '\n');
        // 2. USSD Webhook - Missing fields test (Edge Case)
        console.log('🧪 2. Testing POST /api/ussd (Empty Payload Edge Case)');
        const ussdErrRes = await fetch(`${BASE_URL}/api/ussd`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Missing 'text'
        });
        console.log(`Status: ${ussdErrRes.status} (Should handle gracefully, but might throw 500 if text.split fails)`);
        console.log(`Response:`, await ussdErrRes.text(), '\n');
        // 2b. USSD Webhook - Valid Request (Log a Dry Borehole)
        console.log('🧪 2b. Testing POST /api/ussd (Log Dry Borehole "1*1")');
        const ussdRes = await fetch(`${BASE_URL}/api/ussd`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: 'test-session-123',
                serviceCode: '*384*123#',
                phoneNumber: '+260971234567',
                text: '1*1' // Select Report Borehole -> Confirm
            })
        });
        console.log(`Status: ${ussdRes.status}`);
        console.log(`Response:`, await ussdRes.text(), '\n');
        // 3. AI Crop Scan Endpoint
        console.log('🧪 3. Testing POST /api/scan (Simulating AI processing)');
        const scanRes = await fetch(`${BASE_URL}/api/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageUrl: 'https://example.com/mock-leaf.jpg',
                userId: 'system-youth-officer',
                latitude: -15.4200,
                longitude: 28.2900
            })
        });
        console.log(`Status: ${scanRes.status}`);
        console.log(`Response:`, await scanRes.json(), '\n');
        // 4. GIS Heatmap Aggregation
        console.log('🧪 4. Testing GET /api/reports/heatmap');
        const heatmapRes = await fetch(`${BASE_URL}/api/reports/heatmap`);
        console.log(`Status: ${heatmapRes.status}`);
        const heatmapData = await heatmapRes.json();
        console.log(`Response contains ${heatmapData.length} records. Sample:`, heatmapData[0] || 'No data', '\n');
        // 5. Marketplace Listings
        console.log('🧪 5. Testing GET /api/marketplace');
        const storeRes = await fetch(`${BASE_URL}/api/marketplace`);
        console.log(`Status: ${storeRes.status}`);
        console.log(`Response:`, await storeRes.json(), '\n');
        console.log('✅ Phase 1 API Verification Complete.');
    }
    catch (err) {
        console.error('❌ Test failed with error:', err);
    }
}
runTests();
