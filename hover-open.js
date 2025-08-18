// Opens <details> on hover with a small delay; preserves click/keyboard behavior.
(function () {
  const OPEN_DELAY = 80;
  const CLOSE_DELAY = 160;
  const timers = new WeakMap();

  function clearTimer(el){
    const t = timers.get(el);
    if (t) { clearTimeout(t); timers.delete(el); }
  }

  document.querySelectorAll("details").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      clearTimer(el);
      timers.set(el, setTimeout(() => { el.open = true; }, OPEN_DELAY));
    });

    el.addEventListener("mouseleave", () => {
      clearTimer(el);
      timers.set(el, setTimeout(() => {
        if (!el.matches(":focus-within")) el.open = false;
      }, CLOSE_DELAY));
    });

    const summary = el.querySelector("summary");
    if (summary){
      summary.addEventListener("click", () => clearTimer(el));
      summary.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") clearTimer(el);
      });
    }
  });
})();
