import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect, useCallback } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FsDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
}

interface FsElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIosDevice = /iPad|iPhone|iPod/.test(ua);
  const isMacTouch = window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return isIosDevice || isMacTouch;
}

export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

// Global flag to track pseudo-fullscreen
let isPseudoFullscreenActive = false;

export function isAppInFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  const fsDoc = document as FsDocument;
  const isNativeFs = !!(
    fsDoc.fullscreenElement ||
    fsDoc.webkitFullscreenElement ||
    fsDoc.mozFullScreenElement ||
    fsDoc.msFullscreenElement
  );
  return isNativeFs || isPseudoFullscreenActive || document.documentElement.classList.contains('app-pseudo-fullscreen');
}

export function toggleAppFullscreen(): boolean {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false;

  const fsDoc = document as FsDocument;
  const isNativeFs = !!(
    fsDoc.fullscreenElement ||
    fsDoc.webkitFullscreenElement ||
    fsDoc.mozFullScreenElement ||
    fsDoc.msFullscreenElement
  );

  // Check if native fullscreen is supported (iOS Safari on iPhone returns false / undefined)
  const isNativeSupported = !!(
    document.fullscreenEnabled ||
    fsDoc.webkitFullscreenEnabled
  ) && !isIOS();

  if (isNativeFs) {
    // Exit native fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (fsDoc.webkitExitFullscreen) {
      fsDoc.webkitExitFullscreen();
    } else if (fsDoc.msExitFullscreen) {
      fsDoc.msExitFullscreen();
    }
    isPseudoFullscreenActive = false;
    document.documentElement.classList.remove('app-pseudo-fullscreen');
    document.body.classList.remove('app-pseudo-fullscreen');
    window.dispatchEvent(new CustomEvent('app-fullscreen-change', { detail: { isFullscreen: false } }));
    return false;
  } else if (isPseudoFullscreenActive || document.documentElement.classList.contains('app-pseudo-fullscreen')) {
    // Exit pseudo fullscreen
    isPseudoFullscreenActive = false;
    document.documentElement.classList.remove('app-pseudo-fullscreen');
    document.body.classList.remove('app-pseudo-fullscreen');
    window.dispatchEvent(new CustomEvent('app-fullscreen-change', { detail: { isFullscreen: false } }));
    return false;
  } else {
    // Enter Fullscreen: Try native first if supported, otherwise activate pseudo-fullscreen (iOS & iframes)
    if (isNativeSupported) {
      const elem = document.documentElement as FsElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // If requestFullscreen fails, fallback to pseudo fullscreen
          enablePseudoFullscreen();
        });
      } else if (elem.webkitRequestFullscreen) {
        try {
          elem.webkitRequestFullscreen();
        } catch {
          enablePseudoFullscreen();
        }
      } else {
        enablePseudoFullscreen();
      }
    } else {
      // iOS / WebKit / Standalone Fallback
      enablePseudoFullscreen();
    }
    return true;
  }
}

function enablePseudoFullscreen() {
  isPseudoFullscreenActive = true;
  document.documentElement.classList.add('app-pseudo-fullscreen');
  document.body.classList.add('app-pseudo-fullscreen');

  // Attempt to scroll to top to minimize Safari address bar on iOS
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, 0);
  }

  window.dispatchEvent(new CustomEvent('app-fullscreen-change', { detail: { isFullscreen: true } }));
}

export function useAppFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const checkFs = useCallback(() => {
    setIsFullscreen(isAppInFullscreen());
  }, []);

  useEffect(() => {
    checkFs();

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isFullscreen: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isFullscreen === 'boolean') {
        setIsFullscreen(customEvent.detail.isFullscreen);
      } else {
        checkFs();
      }
    };

    document.addEventListener('fullscreenchange', checkFs);
    document.addEventListener('webkitfullscreenchange', checkFs);
    window.addEventListener('app-fullscreen-change', handleCustomChange);
    window.addEventListener('resize', checkFs);
    window.addEventListener('orientationchange', checkFs);

    return () => {
      document.removeEventListener('fullscreenchange', checkFs);
      document.removeEventListener('webkitfullscreenchange', checkFs);
      window.removeEventListener('app-fullscreen-change', handleCustomChange);
      window.removeEventListener('resize', checkFs);
      window.removeEventListener('orientationchange', checkFs);
    };
  }, [checkFs]);

  return {
    isFullscreen,
    toggleFullscreen: toggleAppFullscreen,
    isIos: isIOS()
  };
}


