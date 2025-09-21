// Back to top
(function(){
  const btt = document.getElementById('backToTop');
  if(!btt) return;
  const btn = btt.querySelector('button');
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if(y > 360){ btt.classList.add('show'); btt.removeAttribute('hidden'); }
    else { btt.classList.remove('show'); btt.setAttribute('hidden',''); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
})();
