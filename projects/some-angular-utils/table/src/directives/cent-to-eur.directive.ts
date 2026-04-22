import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[centToEurDisplay]'
})
export class CentToEurDisplayDirective implements OnChanges {
  @Input('centToEurDisplay') valueInCents: number | string = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('valueInCents' in changes) {
      this.updateView();
    }
  }

  private updateView() {
    const centsNum = typeof this.valueInCents === 'string' ? parseInt(this.valueInCents, 10) : this.valueInCents;
    const euros = isNaN(centsNum) ? '0.00' : (centsNum / 100).toFixed(2);
    this.renderer.setProperty(this.el.nativeElement, 'innerText', euros + ' €');
  }
}
