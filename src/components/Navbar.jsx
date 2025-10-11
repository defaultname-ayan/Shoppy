"use client"
import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { DM_Serif_Display, Instrument_Serif } from 'next/font/google'
import useMediaQuery from '@/hooks/useMediaQuery'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
})

const StaggeredMenu = ({
  position = 'right',
  colors = ['#22C55E', '#16A34A'], // Green colors
  items = [],
  displayItemNumbering = true,
  className,
  logoUrl = '/S-bg-fr.png',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  isFixed = false,
  accentColor = '#16A34A', // Green accent
  onMenuOpen,
  onMenuClose,
  onLogout
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const router = useRouter();

  // All necessary refs
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  // Initialize GSAP animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity']: 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity']: 0 });

        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(opening => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpen) {
      const targetColor = opening ? openMenuButtonColor : menuButtonColor;
      colorTweenRef.current = gsap.to(
        btn,
        { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      gsap.set(btn, { color: menuButtonColor });
    }
  }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const handleNavigation = (link) => {
    if (openRef.current) {
      toggleMenu();
    }
    setTimeout(() => {
      router.push(link);
    }, 150); // Slightly longer delay to ensure menu closes
  };

  const handleLogout = () => {
    if (openRef.current) {
      toggleMenu();
    }
    setTimeout(() => {
      onLogout?.();
    }, 100);
  };

  return (
    <div className={`sm-scope z-40 ${isFixed ? 'fixed top-0 left-0 w-full h-auto' : 'w-full h-full'}`} data-open={open || undefined}>
      <div
  className={(className ? className + ' ' : '') + 'staggered-menu-wrapper relative w-full h-full pointer-events-none'}
  style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
  data-position={position}
  data-open={open || undefined}>

        
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true">
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }} />
            ));
          })()}
        </div>

        <header
          className="staggered-menu-header absolute top-0 left-0 w-full flex items-center p-4 bg-transparent pointer-events-none z-20"
          aria-label="Main navigation header">
          <div
            className="sm-text flex items-center select-none pointer-events-auto"
            aria-label="Shoppy text">
            <span className="text-white text-xl font-bold">Shoppy</span>
          </div>
          
          <div
            className="sm-logo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center select-none pointer-events-auto"
            aria-label="Logo">
            <img
              src={logoUrl}
              alt="Logo"
              className="sm-logo-img block h-8 w-auto object-contain cursor-pointer"
              draggable={false}
              onClick={() => handleNavigation('/')}
              width={110}
              height={24} />
          </div>

          <button
            ref={toggleBtnRef}
            className={`sm-toggle absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer text-[#e9e9ef] font-medium leading-none overflow-visible pointer-events-auto px-3 py-3 min-h-[44px] min-w-[44px] touch-manipulation select-none ${instrumentSerif.className}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            onTouchStart={(e) => e.stopPropagation()}
            style={{ touchAction: 'manipulation' }}
            type="button">
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
              aria-hidden="true">
              <span
                ref={textInnerRef}
                className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
              aria-hidden="true">
              <span
                ref={plusHRef}
                className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]" />
              <span
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]" />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className={`staggered-menu-panel absolute top-0 right-0 h-full bg-white flex flex-col p-[4em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px] w-full ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
          aria-hidden={!open}>
          <div className="sm-panel-inner flex-1 flex flex-col gap-5">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
              role="list"
              data-numbering={displayItemNumbering || undefined}>
              {items && items.length ? (
                items.map((it, idx) => (
                  <li
                    className="sm-panel-itemWrap relative overflow-hidden leading-none"
                    key={it.label + idx}>
                    {it.isLogout ? (
                      <button
                        className={`sm-panel-item relative text-black font-semibold text-[2.5rem] md:text-[3rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear no-underline pr-[1.4em] bg-transparent border-none w-full text-left flex items-center gap-4 min-h-[60px] touch-manipulation select-none pointer-events-auto ${instrumentSerif.className}`}
                        onClick={handleLogout}
                        onTouchStart={(e) => e.stopPropagation()}
                        style={{ touchAction: 'manipulation' }}
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}>
                        
                        <span
                          className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                          {it.label}
                        </span>
                      </button>
                    ) : (
                      <button
                        className={`sm-panel-item relative text-black font-semibold text-[2.5rem] md:text-[3rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear no-underline pr-[1.4em] bg-transparent border-none w-full text-left min-h-[60px] touch-manipulation select-none pointer-events-auto ${instrumentSerif.className}`}
                        onClick={() => handleNavigation(it.link)}
                        onTouchStart={(e) => e.stopPropagation()}
                        style={{ touchAction: 'manipulation' }}
                        aria-label={it.ariaLabel}
                        data-index={idx + 1}>
                        <span
                          className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                          {it.label}
                        </span>
                      </button>
                    )}
                  </li>
                ))
              ) : null}
            </ul>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; }
        .sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; padding: 1rem; background: transparent; pointer-events: none; z-index: 20; }
        .sm-scope .staggered-menu-header > * { pointer-events: auto; }
        .sm-scope .sm-text { display: flex; align-items: center; user-select: none; }
        .sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
        .sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
        .sm-scope .sm-toggle { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; }
        .sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
        .sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
        .sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
        .sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
        .sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
        .sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
        .sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(260px, 38vw, 420px); height: 100%; background: white; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 4em 2em 2em 2em; overflow-y: auto; z-index: 10; }
        .sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
        .sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 420px); pointer-events: none; z-index: 5; }
        .sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
        .sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
        .sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
        .sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 600; font-size: 3rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; text-decoration: none; padding-right: 1.4em; }
        .sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
        .sm-scope .sm-panel-item:hover { color: var(--sm-accent, #16A34A); }
        .sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #16A34A); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
        .sm-scope[data-open] { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; }
        @media (max-width: 768px) { 
          .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } 
          .sm-scope .sm-prelayers { width: 100%; } 
          .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); }
          .sm-scope .sm-panel-item { font-size: 2.5rem; min-height: 60px; padding: 0.5rem 0; }
          .sm-scope .sm-toggle { min-height: 44px; min-width: 44px; padding: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

const Navbar = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Dynamic menu items based on authentication status
  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Home',
        link: '/',
        ariaLabel: 'Navigate to Home page'
      },
      {
        label: 'About Developer',
        link: '/about',
        ariaLabel: 'Learn about the developer'
      }
    ];

    if (user) {
      return [
        ...baseItems,
        {
          label: 'Collections',
          link: '/collection',
          ariaLabel: 'Browse collections'
        },
        {
          label: 'Add Product',
          link: '/add',
          ariaLabel: 'Add a new product'
        },
        {
          label: 'Logout',
          isLogout: true,
          ariaLabel: 'Sign out of your account'
        }
      ];
    } else {
      return [
        ...baseItems,
        {
          label: 'Login',
          link: '/login',
          ariaLabel: 'Sign in to your account'
        }
      ];
    }
  };

  if (isMobile) {
    return (
      <StaggeredMenu
        position="right"
        colors={['#22C55E', '#16A34A', '#15803D']} // Green gradient colors
        items={getMenuItems()}
        displayItemNumbering={true}
        logoUrl="/S-bg-fr.png"
        menuButtonColor="#fff"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        isFixed={true}
        accentColor="#16A34A" // Green accent
        className="z-50"
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className={`p-3 w-full border-b-2 border-white flex items-center text-3xl font-bold ${dmSerifDisplay.className} relative`}>
      <h1 className="text-white text-3xl pl-3">Shoppy</h1>
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
        <img 
          src="/S-bg-fr.png" 
          alt="Shoppy logo" 
          className="h-16 w-auto"
        />
      </div>

      <div className={`${instrumentSerif.className} absolute right-4 flex gap-10 text-2xl font-bold items-center`}>
        <button 
          className="nav-link relative group"
          onClick={() => router.push('/')}
        >
          <span className="transition-colors duration-300 group-hover:text-green-400">
            Home
          </span>
        </button>

        {user ? (
          <>
            <button 
              className="nav-link relative group"
              onClick={() => router.push('/collection')}
            >
              <span className="transition-colors duration-300 group-hover:text-green-400">
                Collections
              </span>
            </button>

            <button 
              className="nav-link relative group"
              onClick={() => router.push('/add')}
            >
              <span className="transition-colors duration-300 group-hover:text-green-400">
                Add Product
              </span>
            </button>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="nav-link relative group flex items-center gap-2 text-lg transition-colors mr-10"
              >
                
                <span className="transition-colors duration-300 group-hover:text-green-400">
                  Logout
                </span>
              </button>
            </div>
          </>
        ) : (
          <button 
            className="nav-link relative group pr-4"
            onClick={() => router.push('/login')}
          >
            <span className="transition-colors duration-300 group-hover:text-green-400">
              Login
            </span>
          </button>
        )}
      </div>

      <style jsx>{`
        .nav-link {
          position: relative;
          display: inline-block;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #22C55E;
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease-out;
        }
        
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  )
}

export default Navbar
