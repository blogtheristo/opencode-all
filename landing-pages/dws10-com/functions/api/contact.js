const MAX_LENGTHS={name:120,email:254,company:160,phone:40,message:4000};
const ALLOWED_ORIGINS=new Set(["https://dws10.com","https://www.dws10.com"]);
function json(body,status){return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});}
function clean(value,maxLength){return typeof value==="string"?value.trim().slice(0,maxLength):"";}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
export async function onRequestPost(context){
 const origin=context.request.headers.get("origin");
 if(origin&&!ALLOWED_ORIGINS.has(origin))return json({error:"Request origin is not allowed."},403);
 let input;try{input=await context.request.json();}catch{return json({error:"Invalid request."},400);}
 if(input===null||typeof input!=="object"||Array.isArray(input))return json({error:"Invalid request."},400);
 if(clean(input.website,80))return json({ok:true},200);
 const fields=Object.fromEntries(Object.entries(MAX_LENGTHS).map(([key,maxLength])=>[key,clean(input[key],maxLength)]));
 if(!fields.name||!fields.company||!fields.phone||!validEmail(fields.email))return json({error:"Please provide a valid name, email, company, and phone number."},400);
 const from=context.env.CONTACT_FROM,to=context.env.CONTACT_TO||"risto.paarni@lifetime.fi";
 if(!from||!context.env.CONTACT_EMAIL)return json({error:"Contact delivery is not configured."},503);
 const body=[`Name: ${fields.name}`,`Email: ${fields.email}`,`Company: ${fields.company}`,`Phone: ${fields.phone}`,"","Message:",fields.message||"(none)"].join("\r\n");
 const subjectName=fields.name.replace(/[\r\n]+/g," ");
 const rawMessage=[`From: ${from}`,`To: ${to}`,`Reply-To: ${fields.email}`,`Subject: Website contact from ${subjectName}`,"Content-Type: text/plain; charset=UTF-8","",body].join("\r\n");
 try{await context.env.CONTACT_EMAIL.send(new EmailMessage(from,to,rawMessage));}catch{return json({error:"The message could not be sent. Please try again later."},502);}
 return json({ok:true},200);
}
