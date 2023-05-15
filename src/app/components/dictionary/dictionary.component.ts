/**
 * Filename: services.dictionary.ts
 * Author: Marcell Dancso
 * Date: 2023-05-15
 * Description: This component handles translation functionality and user input for the dictionary feature.
 * It communicates with the DictionaryService to perform translations and validate user input.
 * License: MIT
 */

import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  DictionaryResult,
  Language,
  TranslateOption,
} from 'src/app/models/dictionary-result.type';
import { DictionaryService } from 'src/app/services/dictionary/dictionary.service';


/**
 * Component: DictionaryComponent
 * Description: This component handles the translation functionality and user interface for the dictionary feature.
 * It interacts with the DictionaryService to perform translations.
 * @Dependencies: FormControl, Validators from '@angular/forms',
 *                Observable, catchError, map from 'rxjs',
 *                DictionaryResult, Language, TranslateOption from 'src/app/models/dictionary-result.type',
 *                DictionaryService from 'src/app/services/dictionary/dictionary.service'
 */
@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css'],
})
export class DictionaryComponent {
  languageCombinations$!: Observable<TranslateOption[]>;
  fromLanguageOptions$!: Observable<Language[]>;
  toLanguageOptions$!: Observable<Language[]>;
  selectedFromLanguage: Language | null = null;
  selectedToLanguage: Language | null = null;

  textFormControl: FormControl;
  text: string = '';

  dictionaryResult$!: Observable<DictionaryResult>;

  /**
  * Description: Initializes the form control for the text input with required and custom validators.
  * @Dependencies: FormControl, Validators from '@angular/forms', singleWordValidator
  */
  constructor(private dictionaryService: DictionaryService) {
    this.textFormControl = new FormControl('', [
      Validators.required,
      this.singleWordValidator,
    ]);
  }

  /**
   * Description: Lifecycle hook that is called after the component is initialized.
   * Retrieves the language combinations supported by the translation service and sets up the 'from' language options.
   */
  ngOnInit() {
    this.languageCombinations$ = this.dictionaryService
      .getLanguageCombinations()
      .pipe(
        catchError((error) => {
          console.error(error);
          return [];
        })
      );

    // selects unique languages that can be translated
    this.fromLanguageOptions$ = this.languageCombinations$.pipe(
      map((languages) => languages.map((lang) => lang.from)),
      map((fromLanguages) => {
        const uniqueLanguages: Language[] = [];
        const seenLanguages: string[] = [];

        for (const lang of fromLanguages) {
          if (!seenLanguages.includes(lang.code)) {
            seenLanguages.push(lang.code);
            uniqueLanguages.push(lang);
          }
        }

        return uniqueLanguages;
      })
    );
  }

  /**
   * Description: Event handler triggered when the 'from' language is selected.
   * Resets the 'to' language selection and updates the available 'to' language options based on the 'from' language.
   */
  onFromLanguageSelected() {
    this.selectedToLanguage = null;
    this.toLanguageOptions$ = this.languageCombinations$.pipe(
      map((toLanguages) =>
        toLanguages.filter(
          (lang) => lang.from.code === this.selectedFromLanguage!.code
        )
      ),
      map((languages) => languages.map((lang) => lang.to)),
      map((toLanguages) => [...new Set<Language>(toLanguages)])
    );
  }

  /**
  Description: Initiates the translation process by calling the DictionaryService to translate the entered text.
  Sets the dictionaryResult$ observable to the translation result or handles any errors that occur.
  */
  translateText() {
    this.dictionaryResult$ = this.dictionaryService
      .translate(
        this.textFormControl.value,
        `${this.selectedFromLanguage!.code}-${this.selectedToLanguage!.code}`
      )
      .pipe(
        catchError((error) => {
          console.error(error);
          return [];
        })
      );
  }

  /**
  Description: Custom validator function to validate that the input contains only a single word.
  @param {FormControl} control - The form control being validated.
  @returns {Object} - Returns an object with the validation error if the input is not a single word, otherwise returns null.
  */
  singleWordValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    const isValid = /^[a-zA-Z]+$/.test(value); // Regular expression to check for single word

    return isValid ? null : { notASingleWord: true };
  }

  /**
  Description: Retrieves the appropriate error message based on the validation state of the text form control.
  @returns {string} - The error message to display.
  */
  getErrorMessage() {
    if (this.textFormControl.hasError('required')) {
      return 'Please enter text';
    }
    if (this.textFormControl.hasError('notASingleWord')) {
      return 'Input must be a single word';
    }
    return '';
  }
}
