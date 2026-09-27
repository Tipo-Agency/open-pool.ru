const CALLTOUCH_MOD_ID = "yykb6p7o";
const YANDEX_METRIKA_ID = 112335661;

const attributionScript = `
(function () {
  try {
    var params = new URLSearchParams(location.search);
    var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','yclid','gclid','fbclid','openstat','calltouch_tm'];
    var saved = JSON.parse(sessionStorage.getItem('openpool_attribution') || '{}');
    if (!saved.landingPage) saved.landingPage = location.href;
    if (!saved.referrer) saved.referrer = document.referrer || '';
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value && !saved[key]) saved[key] = value.slice(0, 500);
    });
    saved.lastPage = location.href;
    sessionStorage.setItem('openpool_attribution', JSON.stringify(saved));
  } catch (error) {}
})();`;

const calltouchScript = `
(function(w,d,n,c){
  w.CalltouchDataObject=n;
  w[n]=w[n]||function(){w[n].callbacks.push(arguments)};
  w[n].callbacks=w[n].callbacks||[];
  w[n].loaded=false;
  w[n].counters=[c];
  var first=d.getElementsByTagName('script')[0];
  var script=d.createElement('script');
  script.async=true;
  script.src='https://mod.calltouch.ru/init-min.js?id='+c;
  first.parentNode.insertBefore(script,first);
})(window,document,'ct','${CALLTOUCH_MOD_ID}');`;

const metrikaScript = `
(function(m,e,t,r,i,k,a){
  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
  k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
ym(${YANDEX_METRIKA_ID},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`;

export function TrackingHeadScripts() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: attributionScript }} />
      <script dangerouslySetInnerHTML={{ __html: calltouchScript }} />
      <script dangerouslySetInnerHTML={{ __html: metrikaScript }} />
    </>
  );
}

export function TrackingNoScript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div><img src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" /></div>
    </noscript>
  );
}

export { CALLTOUCH_MOD_ID, YANDEX_METRIKA_ID };
