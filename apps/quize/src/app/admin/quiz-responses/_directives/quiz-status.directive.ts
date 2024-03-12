import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { QuizResponseStatus } from '@damen/models';

@Directive({
  selector: '[damenQuizeStatus]',
})
export class QuizStatusDirective implements OnInit {
  @Input() status!: QuizResponseStatus;

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {}

  ngOnInit(): void {
    switch (this.status) {
      case QuizResponseStatus.CORRECT: {
        this.renderer.addClass(this.hostElement.nativeElement, 'success');
        this.hostElement.nativeElement.innerHTML = 'done';
        break;
      }
      case QuizResponseStatus.INCORRECT: {
        this.renderer.addClass(this.hostElement.nativeElement, 'error');
        this.hostElement.nativeElement.innerHTML = 'close';
        break;
      }
      case QuizResponseStatus.SKIPED: {
        this.renderer.addClass(this.hostElement.nativeElement, 'info');
        this.hostElement.nativeElement.innerHTML = 'question_mark';
        break;
      }
    }
  }
}
