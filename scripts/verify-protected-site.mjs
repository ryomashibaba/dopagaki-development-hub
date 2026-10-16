// Guard against unintentionally deploying private geometry to a public Pages URL.
// Test existing Pages hostname BEFORE first private data upload. Does not prove
// all deployment aliases are protected: operator must also configure Access wildcard.
const site=process.env.SITE_URL;
if(!site)throw Error('DOPAGAKI_PROTECTED_SITE_URL missing; never deploy without Access');
const url=new URL(site);
if(url.protocol!=='https:')throw Error('Private preview URL must use HTTPS');
const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'Cache-Control':'no-cache'}});
const destination=r.headers.get('location')||'';
const protectedLogin=r.status>=300&&r.status<400&&(/cloudflareaccess\.com/i.test(destination)||/\/cdn-cgi\/access\//i.test(destination));
if(!protectedLogin)throw Error(`Access protection NOT verified (${r.status}, location=${destination.slice(0,140)}). REFUSING to deploy private stages.`);
console.log(`CLOUDFLARE ACCESS PRECONDITION PASS: ${url.hostname} redirects unauthenticated visitor to Access login`);
