import React, { useEffect, useRef, useCallback } from 'react';

// PUBLIC_INTERFACE
const FocusTrap = ({ 
  children, 
  active = true, 
  initialFocus = null, 
  onActivate = null,
  onDeactivate = null,
  autoFocus = true 
}) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);
  const initialFocusRef = useRef(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }, []);

  const setInitialFocus = useCallback(() => {
    if (!containerRef.current || !autoFocus) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    let elementToFocus;
    if (initialFocus && typeof initialFocus === 'string') {
      elementToFocus = containerRef.current.querySelector(initialFocus);
    } else if (initialFocus && initialFocus.current) {
      elementToFocus = initialFocus.current;
    } else {
      elementToFocus = focusableElements[0];
    }

    if (elementToFocus) {
      initialFocusRef.current = elementToFocus;
      elementToFocus.focus();
    }
  }, [initialFocus, autoFocus, getFocusableElements]);

  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement;
      setInitialFocus();
      onActivate?.();
    }
    return () => {
      if (previousFocusRef.current && active) {
        previousFocusRef.current.focus();
        onDeactivate?.();
      }
    };
  }, [active, setInitialFocus, onActivate, onDeactivate]);

  const handleFocus = useCallback((e) => {
    if (!containerRef.current || !active) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    } else if (e.shiftKey && document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    }
  }, [active, getFocusableElements]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        handleFocus(e);
      } else if (e.key === 'Escape') {
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, handleFocus]);

  return (
    <div 
      ref={containerRef}
      role="region"
      aria-label={active ? "Modal content" : undefined}
    >
      {children}
    </div>
  );
};

export default FocusTrap;