"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
// Fetch all available listings
router.get('/', async (req, res) => {
    try {
        const listings = await server_1.prisma.marketplace_Listing.findMany({
            where: { status: 'AVAILABLE' },
            include: { seller: true }
        });
        res.json(listings);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});
// Simulate a "Buy Now" transaction
router.post('/buy', async (req, res) => {
    const { listingId } = req.body;
    try {
        const updatedListing = await server_1.prisma.marketplace_Listing.update({
            where: { id: listingId },
            data: { status: 'SOLD' }
        });
        res.json({
            success: true,
            message: `Successfully purchased ${updatedListing.seedlingType}!`,
            data: updatedListing
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Transaction failed. Item may no longer be available." });
    }
});
exports.default = router;
