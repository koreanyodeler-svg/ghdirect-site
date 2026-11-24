/* 홈페이지 방문·버튼 세기 + 차주용 광고 랜딩 (2026-11-25, 시안 20261125_홈페이지_당근유입_v02, 사장님 "만들어")
 * - 방문: 꼬리표(?src=)별로 브라우저마다 하루 한 번 '/site…' 화면으로 센다(개인정보 없이 숫자만, 기존 유입 통계 표).
 * - 버튼: data-click="driver|shipper" 를 누르면 '/site/click/…' 로 하루 한 번.
 * - 랜딩: 꼬리표의 대상(관리자 '유입 링크'에서 정함)이 차주면 <html class="drv"> — 차주 카드 먼저·강조.
 * 서버 주소·공개 키는 게시할 때 채운다(저장소에는 자리표시만). 비어 있으면 아무것도 안 한다. */
(function () {
  var SB = 'https://yzlocrwxnsskmxipnlss.supabase.co';
  var KEY = 'sb_publishable_CgtVZ5Eohsvg3K0U87SiIA_Il8fUR-W';
  var me = document.currentScript;
  var page = (me && me.getAttribute('data-page')) || '/site';
  var def = (me && me.getAttribute('data-default')) || 'site';
  var on = SB.indexOf('__') !== 0 && KEY.indexOf('__') !== 0;
  var s = '';
  try {
    s = (new URLSearchParams(location.search).get('src') || '').toLowerCase();
  } catch (e) {}
  if (!/^[a-z0-9_]{1,40}$/.test(s)) s = def;
  var d = new Date();
  var day = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

  function rpc(fn, args, keep) {
    if (!on) return Promise.resolve(null);
    return fetch(SB + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      keepalive: !!keep,
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
      .then(function (r) {
        return r.ok && r.status !== 204 ? r.json() : null;
      })
      .catch(function () {
        return null;
      });
  }
  function once(path, keep) {
    var k = 'ghv|' + s + '|' + path + '|' + day;
    try {
      if (localStorage.getItem(k)) return;
      localStorage.setItem(k, '1');
    } catch (e) {}
    rpc('track_visit', { p_src: s, p_path: path }, keep);
  }

  once(page);

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('[data-click]') : null;
    if (a) once('/site/click/' + a.getAttribute('data-click'), true);
  });

  if (page === '/site' && s !== def) {
    var ck = 'ghaud|' + s;
    var apply = function (aud) {
      if (aud === 'driver') document.documentElement.classList.add('drv');
    };
    try {
      apply(sessionStorage.getItem(ck));
    } catch (e) {}
    rpc('site_landing', { p_src: s }).then(function (r) {
      var aud = r && r.audience;
      if (!aud) return;
      try {
        sessionStorage.setItem(ck, aud);
      } catch (e) {}
      apply(aud);
    });
  }
})();
