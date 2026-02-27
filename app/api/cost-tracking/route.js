import { readFile } from 'fs/promises';

export async function GET() {
  try {
    const data = await readFile('/opt/smarterrevolution-infrastructure/status/cost-tracking.json', 'utf8');
    return Response.json(JSON.parse(data));
  } catch {
    return new Response(null, { status: 404 });
  }
}