// Keep internal route changes in the authenticated Site document.
export function navigate(path) {
  const url = new URL(path, window.location.href);
  if (url.origin !== window.location.origin) return;
  history.pushState(null, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}
