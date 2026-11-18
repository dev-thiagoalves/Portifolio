/* ==========================================================
   Portfólio — Thiago Alves da Silva
   Menu, chuva de código, janelas flutuantes, digitação,
   animações de scroll, tilt 3D nos cards e brilho do cursor
   ========================================================== */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- 1. Menu hambúrguer ---------- */
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    function setMenu(open) {
      mobileMenu.classList.toggle('hidden', !open);
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
    menuBtn.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('resize', () => { if (window.innerWidth >= 768) setMenu(false); });

    /* ---------- 2. Chuva de código (canvas) ---------- */
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');
    // Trechos de código que "caem" no fundo
    const tokens = ['const','let','=>','function','return','async','await','SELECT','FROM','WHERE','JOIN',
      'useState','import','export','{ }','[ ]','( )','</>','&&','||','===','null','true','npm','git','0','1',
      'find()','map()','fetch','.then','db.users','INSERT','React','Expo','JSON','API','<div>','class','try','catch'];
    let cols = [], fontSize = isMobile ? 13 : 15, w, h, dpr;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const colWidth = isMobile ? 70 : 90;            // menos colunas = mais leve no celular
      cols = Array.from({ length: Math.ceil(w / colWidth) }, (_, i) => ({
        x: i * colWidth + 8,
        y: Math.random() * -h,
        speed: 0.6 + Math.random() * 1.6,
        txt: tokens[Math.floor(Math.random() * tokens.length)]
      }));
    }
    function drawRain() {
      ctx.fillStyle = 'rgba(5,6,10,.14)';              // rastro
      ctx.fillRect(0, 0, w, h);
      ctx.font = fontSize + 'px "JetBrains Mono", monospace';
      cols.forEach(c => {
        ctx.fillStyle = Math.random() > .96 ? '#ffd5d9' : 'rgba(255,45,63,.85)';
        ctx.fillText(c.txt, c.x, c.y);
        c.y += c.speed * 6;
        if (c.y > h + 40) { c.y = -20; c.txt = tokens[Math.floor(Math.random() * tokens.length)]; c.speed = 0.6 + Math.random() * 1.6; }
      });
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Limita a ~24 fps para economizar bateria
    let last = 0;
    function loop(t) {
      if (t - last > 42) { drawRain(); last = t; }
      requestAnimationFrame(loop);
    }
    if (reduceMotion) { for (let i = 0; i < 40; i++) drawRain(); } else { requestAnimationFrame(loop); }

    /* ---------- 3. Janelas de código flutuantes ---------- */
    const snippets = [
`<span class="k">async function</span> <span class="f">getUsers</span>() {
  <span class="k">const</span> res = <span class="k">await</span> <span class="f">fetch</span>(<span class="s">'/api/users'</span>);
  <span class="k">return</span> res.<span class="f">json</span>();
}`,
`<span class="k">SELECT</span> nome, email
<span class="k">FROM</span> clientes
<span class="k">WHERE</span> ativo = <span class="n">1</span>
<span class="k">ORDER BY</span> criado_em <span class="k">DESC</span>;`,
`<span class="k">const</span> [carrinho, setCarrinho] =
  <span class="f">useState</span>([]);

<span class="k">function</span> <span class="f">add</span>(item) {
  <span class="f">setCarrinho</span>(c => [...c, item]);
}`,
`db.produtos.<span class="f">find</span>({
  preco: { $lt: <span class="n">50</span> },
  estoque: { $gt: <span class="n">0</span> }
}).<span class="f">sort</span>({ preco: <span class="n">1</span> });`,
`<span class="c">// resolve o problema, passo a passo</span>
<span class="k">for</span> (<span class="k">let</span> i = <span class="n">0</span>; i &lt; n; i++) {
  <span class="k">if</span> (<span class="f">resolvido</span>(i)) <span class="k">break</span>;
}`,
`&lt;<span class="k">View</span> style={styles.card}&gt;
  &lt;<span class="k">Text</span>&gt;Cesta Básica&lt;/<span class="k">Text</span>&gt;
  &lt;<span class="k">Button</span> title=<span class="s">"Comprar"</span> /&gt;
&lt;/<span class="k">View</span>&gt;`,
`<span class="k">CREATE TABLE</span> pedidos (
  id <span class="k">INT</span> <span class="k">PRIMARY KEY</span>,
  total <span class="k">DECIMAL</span>(<span class="n">10</span>,<span class="n">2</span>)
);`,
`<span class="f">$</span> git commit -m <span class="s">"feat: novo layout"</span>
<span class="f">$</span> git push origin main
<span class="c">✔ deploy concluído</span>`
    ];
    const floaters = document.getElementById('code-floaters');
    const total = isMobile ? 4 : 9;                    // menos blocos no celular
    for (let i = 0; i < total; i++) {
      const el = document.createElement('div');
      el.className = 'code-window';
      el.innerHTML = snippets[i % snippets.length];
      const col = i % 3;                               // distribui em 3 faixas verticais
      el.style.left = (isMobile ? (i % 2) * 45 + 2 : col * 33 + Math.random() * 10) + '%';
      el.style.top = (Math.random() * 85) + '%';
      el.style.setProperty('--dur', (24 + Math.random() * 24) + 's');
      el.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px');
      el.style.setProperty('--dy', (Math.random() * -100 - 20) + 'px');
      el.style.setProperty('--rot', (Math.random() * 8 - 4) + 'deg');
      el.style.setProperty('--op', (isMobile ? .22 : .28 + Math.random() * .2));
      floaters.appendChild(el);
    }

    /* ---------- 4. Efeito de digitação ---------- */
    const phrases = ['Desenvolvedor Júnior', 'Web & Mobile', 'JavaScript • React Native', 'Bancos SQL e NoSQL'];
    const typedEl = document.getElementById('typed');
    let pi = 0, ci = 0, deleting = false;
    function type() {
      const word = phrases[pi];
      typedEl.textContent = word.slice(0, ci);
      if (!deleting && ci === word.length) { deleting = true; return setTimeout(type, 1600); }
      if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      ci += deleting ? -1 : 1;
      setTimeout(type, deleting ? 35 : 75);
    }
    if (reduceMotion) { typedEl.textContent = phrases[0]; } else { type(); }

    /* ---------- 5. Animação de entrada ao rolar ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      revealEls.forEach(el => io.observe(el));
    } else { revealEls.forEach(el => el.classList.add('visible')); }

    /* ---------- 6. Progresso de leitura + link ativo ---------- */
    const progress = document.getElementById('progress');
    const sections = document.querySelectorAll('main section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 7. Brilho no cursor + tilt 3D nos cards (somente desktop) ---------- */
    if (canHover && !reduceMotion) {
      const glow = document.getElementById('cursor-glow');
      window.addEventListener('mousemove', e => {
        glow.style.opacity = 1;
        glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }, { passive: true });

      document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left, y = e.clientY - r.top;
          card.style.setProperty('--mx', x + 'px');
          card.style.setProperty('--my', y + 'px');
          card.style.setProperty('--ry', ((x / r.width) - .5) * 10 + 'deg');
          card.style.setProperty('--rx', ((y / r.height) - .5) * -10 + 'deg');
        });
        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');
        });
      });
    }

    /* ---------- 8. Ano automático ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();
