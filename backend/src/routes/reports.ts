import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/heatmap', async (req: Request, res: Response) => {
  try {
    const ussdReports = await prisma.uSSD_Report.findMany();
    const cropScans = await prisma.crop_Scan.findMany();

    // Map data to a unified "Pin" format for the frontend
    const mapData = [
      ...ussdReports.map(r => ({
        id: r.id,
        lat: r.latitude,
        lng: r.longitude,
        type: 'REPORT',
        resource: r.resourceType,
        status: r.status, // DRY or VIABLE
        label: `${r.resourceType} - ${r.status}`
      })),
      ...cropScans.map(s => ({
        id: s.id,
        lat: s.latitude || -15.4 + (Math.random() * 0.1), 
        lng: s.longitude || 28.2 + (Math.random() * 0.1),
        type: 'SCAN',
        status: (s.detectedPest === "None" || !s.detectedPest) ? 'VIABLE' : 'DRY',
        label: `Crop: ${s.detectedPest || "Healthy"} (${s.healthPercentage}%)`
      }))
    ];

    res.json(mapData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch map data" });
  }
});

router.get('/live', async (req: Request, res: Response) => {
  try {
    const recentReports = await prisma.uSSD_Report.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: { user: true }
    });

    const recentScans = await prisma.crop_Scan.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: { user: true }
    });

    const feed = [
      ...recentReports.map(r => ({
        id: r.id,
        type: 'INCIDENT',
        title: `Water Crisis: ${r.status} ${r.resourceType}`,
        location: `${r.user.region.toUpperCase()}_NODE_${r.id.slice(0, 4)}`,
        timestamp: r.timestamp,
        coords: { lat: r.latitude, lng: r.longitude }
      })),
      ...recentScans.map(s => ({
        id: s.id,
        type: 'SCAN',
        title: `AI Scan: ${s.detectedPest || 'Healthy'} detected`,
        location: `${s.user.region.toUpperCase()}_SCAN_${s.id.slice(0, 4)}`,
        timestamp: s.timestamp,
        coords: { lat: s.latitude, lng: s.longitude }
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    res.json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch live feed" });
  }
});


export default router;
