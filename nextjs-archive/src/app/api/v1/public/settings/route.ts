import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settingsList = await prisma.systemSetting.findMany();
    const settings = settingsList.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // For public API, we only expose what the mobile app needs
    // We shouldn't expose private keys (like OneSignal REST API Key)
    const publicSettings = {
      siteName: settings.siteName || 'All Sarkari Yojana',
      contactEmail: settings.contactEmail || '',
      playStoreLink: settings.playStoreLink || '',
      appShareLink: settings.appShareLink || '',
      minVersion: parseInt(settings.minVersion || '1', 10),
      latestVersion: parseInt(settings.latestVersion || '1', 10),
      forceUpdate: settings.forceUpdate === 'true',
      maintenanceMode: settings.maintenanceMode === 'true',
      
      // AdMob
      admobAppId: settings.admobAppId || '',
      adAppOpen: settings.adAppOpen || '',
      adBanner: settings.adBanner || '',
      adInterstitial: settings.adInterstitial || '',
      adNative: settings.adNative || '',
      adReward: settings.adReward || '',
      
      // OneSignal & Analytics
      oneSignalAppId: settings.oneSignalAppId || '',
      gaId: settings.gaId || '',
    };

    return NextResponse.json({ success: true, data: publicSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}
