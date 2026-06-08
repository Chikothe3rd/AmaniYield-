"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = sendSMS;
const axios_1 = __importDefault(require("axios"));
/**
 * SMS Gateway Utility for AmaniYield.
 * Integrates with AfricasTalking for Zambian network support.
 */
const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_API_KEY = process.env.AT_API_KEY || 'PLACEHOLDER_KEY';
async function sendSMS(to, message) {
    // sandbox numbers usually start with +254 (KE) or +260 (ZM)
    // ensure number is in E.164 format
    const formattedPhone = to.startsWith('+') ? to : `+${to}`;
    try {
        // Note: AfricasTalking requires form-data encoding for their API
        const params = new URLSearchParams();
        params.append('username', AT_USERNAME);
        params.append('to', formattedPhone);
        params.append('message', `[AmaniYield] ${message}`);
        const response = await axios_1.default.post('https://api.africastalking.com/version1/messaging', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': AT_API_KEY,
                'Accept': 'application/json'
            }
        });
        console.log(`[SMS Gateway] Message sent to ${to}: ${response.data.SMSMessageData.Message}`);
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('[SMS Gateway] Error:', error);
        // Silent fail in development to avoid crashing USSD session
        return { success: false, error: 'Failed to dispatch SMS' };
    }
}
