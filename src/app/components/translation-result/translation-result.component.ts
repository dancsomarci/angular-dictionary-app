/**
 * Filename: services.dictionary.ts
 * Author: Marcell Dancso
 * Date: 2023-05-15
 * Description: This component displays the translation result obtained from the dictionary service.
 * It receives the translation result as an input and renders it in the template.
 * License: MIT
 */

import { Component, Input } from '@angular/core';
import { DictionaryResult } from 'src/app/models/dictionary-result.type';

@Component({
  selector: 'app-translation-results',
  templateUrl: './translation-result.component.html',
  styleUrls: ['./translation-result.component.css'],
})
export class TranslationResultComponent {
  @Input()
  result: DictionaryResult | null = null;
}
