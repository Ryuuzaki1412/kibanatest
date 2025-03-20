"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textAnalysisSettings = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const languageData = {
  da: {
    name: 'Danish',
    stemmer: 'danish',
    stop_words: '_danish_'
  },
  de: {
    name: 'German',
    stemmer: 'light_german',
    stop_words: '_german_'
  },
  en: {
    name: 'English',
    stemmer: 'light_english',
    stop_words: '_english_'
  },
  es: {
    name: 'Spanish',
    stemmer: 'light_spanish',
    stop_words: '_spanish_'
  },
  fr: {
    name: 'French',
    stemmer: 'light_french',
    stop_words: '_french_',
    custom_filter_definitions: {
      'fr-elision': {
        type: 'elision',
        articles: ['l', 'm', 't', 'qu', 'n', 's', 'j', 'd', 'c', 'jusqu', 'quoiqu', 'lorsqu', 'puisqu'],
        articles_case: true
      }
    },
    prepended_filters: ['fr-elision']
  },
  it: {
    name: 'Italian',
    stemmer: 'light_italian',
    stop_words: '_italian_',
    custom_filter_definitions: {
      'it-elision': {
        type: 'elision',
        articles: ['c', 'l', 'all', 'dall', 'dell', 'nell', 'sull', 'coll', 'pell', 'gl', 'agl', 'dagl', 'degl', 'negl', 'sugl', 'un', 'm', 't', 's', 'v', 'd'],
        articles_case: true
      }
    },
    prepended_filters: ['it-elision']
  },
  ja: {
    name: 'Japanese',
    stemmer: 'light_english',
    stop_words: '_english_',
    postpended_filters: ['cjk_bigram']
  },
  ko: {
    name: 'Korean',
    stemmer: 'light_english',
    stop_words: '_english_',
    postpended_filters: ['cjk_bigram']
  },
  nl: {
    name: 'Dutch',
    stemmer: 'dutch',
    stop_words: '_dutch_'
  },
  pt: {
    name: 'Portuguese',
    stemmer: 'light_portuguese',
    stop_words: '_portuguese_'
  },
  'pt-br': {
    name: 'Portuguese (Brazil)',
    stemmer: 'brazilian',
    stop_words: '_brazilian_'
  },
  ru: {
    name: 'Russian',
    stemmer: 'russian',
    stop_words: '_russian_'
  },
  th: {
    name: 'Thai',
    stemmer: 'light_english',
    stop_words: '_thai_'
  },
  zh: {
    name: 'Chinese',
    stemmer: 'light_english',
    stop_words: '_english_',
    postpended_filters: ['cjk_bigram']
  }
};
const FRONT_NGRAM_MAX_GRAM = 12;
const genericFilters = {
  front_ngram: {
    type: 'edge_ngram',
    min_gram: 1,
    max_gram: FRONT_NGRAM_MAX_GRAM
  },
  delimiter: {
    type: 'word_delimiter_graph',
    generate_word_parts: true,
    generate_number_parts: true,
    catenate_words: true,
    catenate_numbers: true,
    catenate_all: true,
    preserve_original: false,
    split_on_case_change: true,
    split_on_numerics: true,
    stem_english_possessive: true
  },
  bigram_joiner: {
    type: 'shingle',
    token_separator: '',
    max_shingle_size: 2,
    output_unigrams: false
  },
  bigram_joiner_unigrams: {
    type: 'shingle',
    token_separator: '',
    max_shingle_size: 2,
    output_unigrams: true
  },
  bigram_max_size: {
    type: 'length',
    min: 0,
    max: 16
  }
};
const textAnalysisSettings = (language = 'en') => {
  return {
    analysis: {
      analyzer: analyzerDefinitions(language),
      filter: filterDefinitions(language)
    }
  };
};
exports.textAnalysisSettings = textAnalysisSettings;
const stemFilterName = languageCode => {
  return `${languageCode}-stem-filter`;
};
const stopWordsFilterName = languageCode => {
  return `${languageCode}-stop-words-filter`;
};
const analyzerDefinitions = language => {
  const prependedFilters = languageData[language].prepended_filters || [];
  const postpendedFilters = languageData[language].postpended_filters || [];
  return {
    i_prefix: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['cjk_width', 'lowercase', 'asciifolding', 'front_ngram']
    },
    q_prefix: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['cjk_width', 'lowercase', 'asciifolding']
    },
    iq_text_base: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['cjk_width', 'lowercase', 'asciifolding', stopWordsFilterName(language)]
    },
    iq_text_stem: {
      type: 'custom',
      tokenizer: 'standard',
      filter: [...prependedFilters, 'cjk_width', 'lowercase', 'asciifolding', stopWordsFilterName(language), stemFilterName(language), ...postpendedFilters]
    },
    iq_text_delimiter: {
      type: 'custom',
      tokenizer: 'whitespace',
      filter: [...prependedFilters, 'delimiter', 'cjk_width', 'lowercase', 'asciifolding', stopWordsFilterName(language), stemFilterName(language), ...postpendedFilters]
    },
    i_text_bigram: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['cjk_width', 'lowercase', 'asciifolding', stemFilterName(language), 'bigram_joiner', 'bigram_max_size']
    },
    q_text_bigram: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['cjk_width', 'lowercase', 'asciifolding', stemFilterName(language), 'bigram_joiner_unigrams', 'bigram_max_size']
    }
  };
};
const filterDefinitions = language => {
  const stemmerName = languageData[language].stemmer;
  const stopWordsName = languageData[language].stop_words;
  const customFilterDefinitions = languageData[language].custom_filter_definitions || {};
  return {
    ...genericFilters,
    [stemFilterName(language)]: {
      language: stemmerName,
      name: stemmerName,
      type: 'stemmer'
    },
    [stopWordsFilterName(language)]: {
      stopwords: stopWordsName,
      type: 'stop'
    },
    ...customFilterDefinitions
  };
};