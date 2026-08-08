// Runs before first paint to avoid a flash of the wrong theme. External file
// (not inline in index.html) deliberately — an inline script would need its
// exact content hashed into the CSP script-src header, a value that silently
// breaks on the next edit; an external same-origin script needs no hash at
// all under `script-src 'self'`.
(function () {
  var stored = localStorage.getItem('zerivon-theme');
  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
