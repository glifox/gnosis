const styleId = 'cm-widget-bullet-style';

if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
cm-widget-bullet {
  position: relative;
  display: inline;
}

cm-widget-bullet:not(.mk-show) {
  visibility: hidden;
}

cm-widget-bullet:not(.mk-show)::before {
  visibility: visible;
}

cm-widget-bullet:not(.mk-show) * {
  visibility: hidden;
}

cm-widget-bullet::before {
  content: "";
  display: inline;
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: .4em;
  width: .4em;
  background-color: var(--cm-bullet-bg, currentColor);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
  pointer-events: none;
}

cm-widget-bullet.mk-show::before {
  display: none;
}
`;
  document.head?.appendChild(style);
}

class Bullet extends HTMLElement {
  static observedAttributes = ['class'];

  private themeObserver?: MutationObserver;
  private childObserver?: MutationObserver;
  private themeListener?: () => void;

  constructor() {
    super();
  }

  connectedCallback() {
    this.updateColor();

    requestAnimationFrame(() => {
      this.updateColor();
    });

    this.themeListener = () => this.updateColor();
    document.addEventListener('th-changed', this.themeListener);

    if (typeof MutationObserver !== 'undefined') {
      this.themeObserver = new MutationObserver(() => this.updateColor());
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['theme', 'class', 'style'],
      });

      const editor = this.closest('.cm-editor');
      if (editor) {
        this.themeObserver.observe(editor, {
          attributes: true,
          attributeFilter: ['class', 'style'],
        });
      }

      this.childObserver = new MutationObserver(() => this.updateColor());
      this.childObserver.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }
  }

  disconnectedCallback() {
    if (this.themeListener) {
      document.removeEventListener('th-changed', this.themeListener);
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
    if (this.childObserver) {
      this.childObserver.disconnect();
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    if (name === 'class') {
      this.updateColor();
    }
  }

  updateColor() {
    const color = this.getGuionColor();
    this.style.setProperty('--cm-bullet-bg', color);
  }

  private getGuionColor(): string {
    // 1. Revisar si el guion tiene elementos hijos (spans de sintaxis, etc.)
    const children = this.querySelectorAll('*');
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i] as HTMLElement;
      if (child.textContent && child.textContent.trim().length > 0) {
        const color = getComputedStyle(child).color;
        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
          return color;
        }
      }
    }

    // 2. Revisar el propio elemento
    const myColor = getComputedStyle(this).color;
    if (myColor && myColor !== 'transparent' && myColor !== 'rgba(0, 0, 0, 0)') {
      return myColor;
    }

    // 3. Fallback al elemento padre (.cm-line)
    if (this.parentElement) {
      const parentColor = getComputedStyle(this.parentElement).color;
      if (parentColor && parentColor !== 'transparent' && parentColor !== 'rgba(0, 0, 0, 0)') {
        return parentColor;
      }
    }

    return 'currentColor';
  }
}

if (!customElements.get('cm-widget-bullet')) {
  customElements.define('cm-widget-bullet', Bullet);
}
