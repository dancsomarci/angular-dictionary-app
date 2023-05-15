import { environment } from './../../../config/config';
/**
 * Filename: services.dictionary.ts
 * Author: Marcell Dancso
 * Date: 2023-05-15
 * Description: This service provides translation functionality using the Yandex Dictionary API.
 * It also handles caching of translations and language combinations.
 * License: MIT
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import {
  DictionaryResult,
  Language,
  TranslateOption,
} from 'src/app/models/dictionary-result.type';

/**
 * Component: DictionaryService
 * Description: This service handles translation requests and caching of translations and language combinations.
 * It communicates with the Yandex Dictionary API to perform translations.
 * @Dependencies: HttpClient from '@angular/common/http'
 */

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private apiUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/';
  // https://yandex.com/dev/dictionary/
  private apiKey = environment.yandexDictionaryApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Translates a given text to the specified language.
   * @param {string} text - The text to be translated.
   * @param {string} lang - The target language code.
   * @returns {Observable<DictionaryResult>} An observable containing the translation result.
   */
  translate(text: string, lang: string): Observable<DictionaryResult> {
    // Set the Content-Type header
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    // Transform the text input to lowercase for caching purposes
    const lowercaseText = text.toLowerCase();

    // Generate a cache key based on the lowercase text and language
    const cacheKey = `${lowercaseText}-${lang}`;

    // Check if translation exists in localStorage
    const cachedTranslation = localStorage.getItem(cacheKey);
    if (cachedTranslation) {
      // Parse and return the cached translation
      return of(JSON.parse(cachedTranslation));
    } else {
      // Set the parameters for the translation API request
      const params = new HttpParams()
        .set('key', this.apiKey)
        .set('lang', lang)
        .set('text', text);

      // Send the HTTP GET request to the translation API
      return this.http
        .get<DictionaryResult>(this.apiUrl + 'lookup', {
          headers,
          params,
        })
        .pipe(
          tap((translation) => {
            // Cache the translation in localStorage
            localStorage.setItem(cacheKey, JSON.stringify(translation));
          })
        );
    }
  }

  /**
   * Retrieves the language combinations supported by the translation service.
   * @returns {Observable<TranslateOption[]>} An observable containing the language combinations.
   */
  getLanguageCombinations(): Observable<TranslateOption[]> {
    const params = {
      key: this.apiKey,
    };

    // Check if language combinations exist in localStorage
    const cachedLanguageCombinations = localStorage.getItem(
      'languageCombinations'
    );
    if (cachedLanguageCombinations) {
      // Parse and return the cached language combinations
      return of(JSON.parse(cachedLanguageCombinations));
    } else {
      // Fetch language combinations from the API and cache the result in localStorage
      return this.http.get<string[]>(this.apiUrl + 'getLangs', { params }).pipe(
        map((codes) =>
          codes.map((code) => {
            const splitCode = code.split('-');
            return {
              from: {
                code: splitCode[0],
                fullName: this.getLanguageName(splitCode[0]),
              } as Language,
              to: {
                code: splitCode[1],
                fullName: this.getLanguageName(splitCode[1]),
              } as Language,
            } as TranslateOption;
          })
        ),
        tap((languageCombinations) => {
          // Cache the language combinations in localStorage
          localStorage.setItem(
            'languageCombinations',
            JSON.stringify(languageCombinations)
          );
        })
      );
    }
  }

  /**
  Retrieves the full name of a language based on its language code.
  @param {string} languageCode - The language code.
  @returns {string} The full name of the language.
  */
  private getLanguageName(languageCode: string): string {
    const languageMapping: { [code: string]: string } = {
      en: 'English',
      zh: 'Chinese',
      hi: 'Hindi',
      es: 'Spanish',
      fr: 'French',
      ar: 'Arabic',
      bn: 'Bengali',
      ru: 'Russian',
      pt: 'Portuguese',
      id: 'Indonesian',
      ur: 'Urdu',
      ja: 'Japanese',
      de: 'German',
      pa: 'Punjabi',
      jv: 'Javanese',
      sw: 'Swahili',
      te: 'Telugu',
      vi: 'Vietnamese',
      ko: 'Korean',
      mr: 'Marathi',
      ta: 'Tamil',
      it: 'Italian',
      tr: 'Turkish',
      pl: 'Polish',
      uk: 'Ukrainian',
      nl: 'Dutch',
      fa: 'Persian',
      th: 'Thai',
      gu: 'Gujarati',
      ro: 'Romanian',
      uz: 'Uzbek',
      am: 'Amharic',
      bg: 'Bulgarian',
      ms: 'Malay',
      ca: 'Catalan',
      hu: 'Hungarian',
      sv: 'Swedish',
      cs: 'Czech',
      el: 'Greek',
      he: 'Hebrew',
      no: 'Norwegian',
      fi: 'Finnish',
      da: 'Danish',
      sk: 'Slovak',
      lt: 'Lithuanian',
      sl: 'Slovenian',
      et: 'Estonian',
      lv: 'Latvian',
      mt: 'Maltese',
      be: 'Belarusian',
      mhr: 'Eastern Mari',
      mrj: 'Hill Mari',
      tt: 'Tatar',
      emj: 'Eastern Meohja',
    };

    const languageName = languageMapping[languageCode];
    if (languageName) {
      return languageName;
    }
    // If there's no match, fallback to the short language code
    return languageCode;
  }
}
