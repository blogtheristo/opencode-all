const META_PIXEL_ID = "1061355716618688";

const snippet = (id) => `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
`;

const MAX_HTML_BYTES = 2_000_000;

async function readHtml(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return null;

  const buf = await response.arrayBuffer();
  if (!buf || buf.byteLength > MAX_HTML_BYTES) return null;
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buf);
}

export async function onRequest(context) {
  const response = await context.next();
  if (!response || response.status >= 400) return response;

  const pixelId = context.env?.META_PIXEL_ID || META_PIXEL_ID;
  if (!pixelId || pixelId === "YOUR_PIXEL_ID") return response;

  const html = await readHtml(response);
  if (!html || html.includes("connect.facebook.net/en_US/fbevents.js")) {
    return response;
  }

  const injected = html.replace(
    /<head[^>]*>/i,
    (head) => head + "\n" + snippet(pixelId)
  );

  if (injected === html) return response;

  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}