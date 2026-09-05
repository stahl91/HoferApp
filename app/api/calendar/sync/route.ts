import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { google } from "googleapis";

function parseTitle(title: string) {
  const m = title.match(/^(.+?)\s+(\d+)\s*min(?:ute[s]?)?\s+\$?\s*(\d+(?:\.\d{1,2})?)\s*\$?\s*$/i);
  if (!m) return null;
  return { name: m[1].trim(), minutes: Number(m[2]), revenueCents: Math.round(Number(m[3]) * 100) };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", {status:401});

  const account = await prisma.account.findFirst({where:{userId:session.user.id,provider:"google"}});
  if (!account?.access_token) return new Response("Google Calendar is not connected. Sign in again to grant Calendar read-only access.", {status:400});

  const oauth2 = new google.auth.OAuth2(process.env.AUTH_GOOGLE_ID, process.env.AUTH_GOOGLE_SECRET);
  oauth2.setCredentials({access_token: account.access_token, refresh_token: account.refresh_token || undefined});
  const cal = google.calendar({version:"v3",auth:oauth2});
  const result = await cal.events.list({calendarId:process.env.GOOGLE_CALENDAR_ID||"primary",timeMin:new Date(new Date().getFullYear(),new Date().getMonth()-1,1).toISOString(),maxResults:2500,singleEvents:true,orderBy:"startTime"});
  console.log("=== CALENDAR EVENTS ==="); console.dir(result.data.items?.map(e => ({ id: e.id, summary: e.summary, start: e.start })) ?? [], { depth: 5 }); let imported=0;
  for (const e of result.data.items||[]) {
    if (!e.id || !e.summary || !e.start?.dateTime) continue;
    const parsed=parseTitle(e.summary);
    if (!parsed) continue;
    let client=await prisma.client.findFirst({where:{userId:session.user.id,name:parsed.name}});
    if (!client) client=await prisma.client.create({data:{userId:session.user.id,name:parsed.name}});
    await prisma.sessionRecord.upsert({
      where:{googleEventId:e.id},
      update:{clientId:client.id,startAt:new Date(e.start.dateTime),endAt:e.end?.dateTime?new Date(e.end.dateTime):null,minutes:parsed.minutes,revenueCents:parsed.revenueCents,title:e.summary},
      create:{userId:session.user.id,clientId:client.id,googleEventId:e.id,startAt:new Date(e.start.dateTime),endAt:e.end?.dateTime?new Date(e.end.dateTime):null,minutes:parsed.minutes,revenueCents:parsed.revenueCents,title:e.summary}
    });
    imported++;
  }
  return Response.redirect(new URL(`/?synced=${imported}`, process.env.NEXTAUTH_URL||"http://localhost:3000"));
}