import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ControlContainer,
  FormControlDirective,
  NgControl,
} from '@angular/forms';

declare const window: any;
const defaultUtilScript =
  'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.1/js/utils.js';

@Directive({
  selector: '[damenTelInput]',
})
export class Ng2TelInputDirective implements OnInit {
  @Input() ng2TelInputOptions: { [key: string]: any } = {};
  @Output() hasError: EventEmitter<boolean> = new EventEmitter();
  @Output() ng2TelOutput: EventEmitter<any> = new EventEmitter();
  @Output() countryChange: EventEmitter<any> = new EventEmitter();
  @Output() intlTelInputObject: EventEmitter<any> = new EventEmitter();

  ngTelInput: any;

  constructor(
    private control: NgControl,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ng2TelInputOptions = {
        ...this.ng2TelInputOptions,
        utilsScript: this.getUtilsScript(this.ng2TelInputOptions),
      };
      this.ngTelInput = window.intlTelInput(this.el.nativeElement, {
        ...this.ng2TelInputOptions,
        preferredCountries: ['nl'],
      });

      this.el.nativeElement.addEventListener('countrychange', () => {
        this.countryChange.emit(this.ngTelInput.getSelectedCountryData());
      });

      this.intlTelInputObject.emit(this.ngTelInput);
      this.ngTelInput.setCountry('nl');
    }
  }

  @HostListener('blur') onBlur() {
    const isInputValid = this.isInputValid();
    if (isInputValid) {
      const telOutput = this.ngTelInput.getNumber();
      this.hasError.emit(isInputValid);
      this.ng2TelOutput.emit(telOutput);
      // console.log(this.el.nativeElement);
      // this.control.valueAccessor?.writeValue('');
      this.control.control?.setValue(telOutput, {
        emitModelToViewChange: false,
      });

      // this.ctrlD.valueAccessor.writeValue("display value")
    } else {
      this.hasError.emit(isInputValid);
    }
  }

  isInputValid(): boolean {
    return this.ngTelInput.isValidNumber();
  }

  setCountry(country: any) {
    this.ngTelInput.setCountry(country);
  }

  getUtilsScript(options: any) {
    return options.utilsScript || defaultUtilScript;
  }
}
