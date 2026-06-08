import { getSocialSize } from 'modules/utils/social-image';
import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id') || '';
  const type = searchParams.get('type') || '';
  const platform = searchParams.get('platform') || '';
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const searchParamsString = searchParams.toString();

  const page = await browser.newPage();
  const imageSize = getSocialSize(platform || '');
  await page.setViewport({ width: imageSize.width, height: imageSize.height });
  const headersList = await headers();
  const hostname = (await headersList).get('x-domain') || '';
  const protocol = hostname.includes('localhost') ? 'http' : 'https';
  await page.goto(`${protocol}://${hostname}/images?${searchParamsString}`, {
    // waitUntil: 'networkidle0',
  });

  const widgetContainer = await page.$('#main-image');
  const boundingBox = await widgetContainer?.boundingBox();
  if (boundingBox) {
    const image = await page.screenshot({
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    });
    await browser.close();
    return new Response(Buffer.from(image), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': `${image.length}`,
        // 'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${platform ? `${platform}-` : ''}${type ? `${type}-` : ''}-${id ? `${id}-` : ''}featured.png"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  return new Response(null, {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
