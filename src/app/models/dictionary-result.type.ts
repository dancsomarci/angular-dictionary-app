/**
 * Filename: dictionary-result.type.ts
 * Author: Marcell Dancso
 * Date: 2023-05-15
 * Description: This file defines the interfaces used to represent the dictionary translation result.
 * It also handles caching of translations and language combinations.
 * License: MIT
 */

export interface DictionaryResult {
  head: Head;
  def: Definition[];
}

export interface Head {}

export interface Definition {
  text: string;
  pos: string;
  tr: Translation[];
}

export interface Translation {
  text: string;
  pos: string;
  syn: Synonym[];
  mean: Meaning[];
  ex: Example[];
}

export interface Synonym {
  text: string;
}

export interface Meaning {
  text: string;
}

export interface Example {
  text: string;
  tr: Translation[];
}

export interface Language {
  code: string;
  fullName: string;
}

export interface TranslateOption {
  from: Language;
  to: Language;
}
