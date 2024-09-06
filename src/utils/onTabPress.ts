import { RefObject } from 'react';

export const onTabPress = (event: KeyboardEvent, modalRef: RefObject<HTMLElement>) => {
  const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (!focusableElements || focusableElements.length === 0) {
    return;
  }

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

  if (event.shiftKey) {
    if (activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    }
  } else if (activeElement === lastFocusableElement) {
    event.preventDefault();
    firstFocusableElement.focus();
  }

  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === 'textarea' || tagName === 'input') {
    const isTextArea = tagName === 'textarea';
    const isInputText = activeElement.getAttribute('type') === 'text';

    if (isTextArea || isInputText) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;

      if (start !== end || start !== activeElement.value.length) {
        return;
      }
    }
  }
};
