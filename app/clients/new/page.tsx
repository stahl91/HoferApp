import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { redirect } from "next/navigation";

async function createClient(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  await prisma.client.create({data:{
    userId:session.user.id,
    name:String(formData.get("name")||"").trim(),
    email:String(formData.get("email")||"").trim()||null,
    phone:String(formData.get("phone")||"").trim()||null,
    notes:String(formData.get("notes")||"").trim()||null
  }});
  redirect("/clients");
}
export default function NewClient(){return <div className="card"><h1>New Client</h1><form action={createClient} className="form">
<input className="input" name="name" placeholder="Full name" required/>
<input className="input" name="email" placeholder="Email"/>
<input className="input" name="phone" placeholder="Phone"/>
<textarea className="input" name="notes" placeholder="Notes"/>
<button className="btn">Save client</button></form></div>}