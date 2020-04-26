from typing import Dict, Tuple, List
import numpy as np
from nltk import word_tokenize
from nltk.corpus import stopwords
import nltk
import string
from nltk.stem import WordNetLemmatizer
from unidecode import unidecode


def tokenaze_sentences(data: str):
    tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    sentences = tokenizer.tokenize(data)
    return sentences


def preprocess_doc(sentences: List[str]):
    sentences = [s.strip() for s in sentences]
    stopset = stopwords.words('english') + list(string.punctuation)
    lemmatizer = WordNetLemmatizer()
    corpus = []
    for s in sentences:
        s = s.strip().lower()
        s = [unidecode(w) for w in word_tokenize(s) if w not in stopset]
        s = [lemmatizer.lemmatize(w) for w in s]
        corpus.append(s)
    return corpus


def vectorize_corpus(corpus: List[List[str]], model):
    not_found_words = []
    row_cnt = len(corpus)
    col_cnt = model.vector_size
    doc_vec = np.zeros((row_cnt, col_cnt), dtype=float)
    for i, sentence in enumerate(corpus):
        sentence_vec = doc_vec[i, :]
        words_cnt = 0
        for word in sentence:
            try:
                word_vec = model[word]
                sentence_vec += word_vec
                words_cnt += 1
            except KeyError as e:
                not_found_words.append(word)
        if words_cnt > 0:
            sentence_vec /= words_cnt

    not_found_words = list(set(not_found_words))  # remove duplicates
    return doc_vec, not_found_words
