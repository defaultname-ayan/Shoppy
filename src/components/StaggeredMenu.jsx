// components/StaggeredMenu.jsx
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';

export const StaggeredMenu = ({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/S-bg-fr.png',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  isFixed = false,
  accentColor = '#5227FF',
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const router = useRouter();

  // ... (keep all your existing refs and animation logic)

  const handleNavigation = (link) => {
    // Close menu before navigation
    if (openRef.current) {
      toggleMenu();
    }
    // Small delay to allow menu animation to start
    setTimeout(() => {
      router.push(link);
    }, 100);
  };

  // ... (keep all your existing animation functions)

  return (
    <div className={`sm-scope z-40 ${isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden' : 'w-full h-full'}`}>
      <div
        className={(className ? className + ' ' : '') + 'staggered-menu-wrapper relative w-full h-full'}
        style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}>
        
        {/* Pre-layers for animation */}
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

        {/* Header with logo and hamburger menu */}
        <header
          className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-4 bg-transparent pointer-events-none z-20"
          aria-label="Main navigation header">
          <div
            className="sm-logo flex items-center select-none pointer-events-auto"
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
            className="sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer text-[#e9e9ef] font-medium leading-none overflow-visible pointer-events-auto px-2 py-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
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

        {/* Menu Panel */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full bg-white flex flex-col p-[4em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px] w-full"
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
                    <button
                      className="sm-panel-item relative text-black font-semibold text-[3rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em] bg-transparent border-none w-full text-left"
                      onClick={() => handleNavigation(it.link)}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}>
                      <span
                        className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </button>
                  </li>
                ))
              ) : null}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div
                className="sm-socials mt-auto pt-8 flex flex-col gap-3"
                aria-label="Social links">
                <h3
                  className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">
                  Socials
                </h3>
                <ul
                  className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                  role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link text-[1.2rem] font-medium text-[#111] no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Enhanced mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .sm-scope .staggered-menu-panel {
            width: 100%;
            left: 0;
            right: 0;
          }
          .sm-scope .sm-prelayers {
            width: 100%;
          }
          .sm-scope .sm-panel-item {
            font-size: 2.5rem;
          }
          .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img {
            filter: invert(100%);
          }
        }
        
        .sm-scope .sm-panel-item:hover {
          color: var(--sm-accent, #5227FF);
        }
        
        .sm-scope .sm-panel-list[data-numbering] {
          counter-reset: smItem;
        }
        
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem;
          content: counter(smItem, decimal-leading-zero);
          position: absolute;
          top: 0.1em;
          right: 3.2em;
          font-size: 18px;
          font-weight: 400;
          color: var(--sm-accent, #5227FF);
          letter-spacing: 0;
          pointer-events: none;
          user-select: none;
          opacity: var(--sm-num-opacity, 0);
        }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
