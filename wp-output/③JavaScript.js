/**
 * ③ JavaScript
 * WPCode プラグイン等で「フッターに挿入」するか、
 * functions.php で wp_footer にフック、もしくは
 * カスタムHTMLブロックの末尾に <script>...</script> で直接埋め込み可。
 *
 * 依存なし（jQuery 不要）。既存テーマのJSと競合しません。
 */
(function () {
  'use strict';

  /* --------------------------------------------------
     カード hover アクセシビリティ補助
     （キーボードフォーカスでも hover 効果を付与）
  -------------------------------------------------- */
  document.querySelectorAll('.fc-food-card, .fc-service-card').forEach(function (el) {
    el.addEventListener('focusin', function () {
      el.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)';
      if (el.classList.contains('fc-food-card')) {
        el.style.transform = 'translateY(-2px)';
      }
    });
    el.addEventListener('focusout', function () {
      el.style.boxShadow = '';
      el.style.transform = '';
    });
  });

  /* --------------------------------------------------
     画像の遅延読み込みフォールバック
     （テーマの lazyload が効かない場合の保険）
  -------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var lazyImgs = document.querySelectorAll('.fc-wrap img[data-src]');
    if (lazyImgs.length) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImgs.forEach(function (img) { imgObserver.observe(img); });
    }
  }

  /* --------------------------------------------------
     スクロールアニメーション
     （カードが画面内に入ったときフェードイン）
  -------------------------------------------------- */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

    /* アニメーション対象にクラスを付与 */
    document.querySelectorAll(
      '.fc-service-card, .fc-food-card, .fc-care-item'
    ).forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .45s ease ' + (i % 3) * 0.08 + 's, transform .45s ease ' + (i % 3) * 0.08 + 's, box-shadow .22s ease';
    });

    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(
      '.fc-service-card, .fc-food-card, .fc-care-item'
    ).forEach(function (el) { animObserver.observe(el); });
  }

})();
