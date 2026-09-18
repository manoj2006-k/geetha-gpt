/**
 * Geetha GPT - Floating Toast Notification System
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'success', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-4 opacity-0 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
      type === 'success'
        ? 'bg-amber-900/90 text-amber-50 border-amber-600/40 backdrop-blur-md dark:bg-amber-950/95 dark:text-amber-100 dark:border-amber-500/40'
        : 'bg-stone-900/90 text-stone-100 border-stone-700/50 backdrop-blur-md'
    }`;

    const iconHtml = type === 'success'
      ? `<span class="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">✓</span>`
      : `<span class="flex-shrink-0 w-6 h-6 rounded-full bg-stone-500/20 text-stone-300 flex items-center justify-center font-bold text-xs">ℹ</span>`;

    toast.innerHTML = `
      ${iconHtml}
      <div class="flex-1">${message}</div>
    `;

    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }
}

export const toastManager = new ToastManager();

