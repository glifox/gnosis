class Scroller extends HTMLElement {
  static observedAttributes = ['style'];
  unlocked: boolean = true;
  internalStyleUpdate: boolean = false; // Semáforo de bloqueo
  
  constructor() {
    super();
    
    this.addEventListener('scroll', (event) => {      
      if (this.unlocked) {
        requestAnimationFrame(() => {
          this.updateScrollX();
          this.unlocked = true;
        });
        this.unlocked = false;
      }
    }); // No olvides esta optimización para el scroll

    requestAnimationFrame(() => this.updateScrollX());
  }
  
  updateScrollX() {
    this.internalStyleUpdate = true; 
    // console.info('updated')
    this.style.setProperty('--scroll-x', `${this.scrollLeft}px`);
    this.internalStyleUpdate = false; 
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.internalStyleUpdate) return; 

    if (name === 'style' && oldValue !== newValue) {
        this.updateScrollX(); 
        // console.info(`change style procesado desde script externo`);
    }
  }
}

customElements.define('code-scroller', Scroller);