from typing import Dict, Tuple, List, Union
import datetime
import json
from databases import Database
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from config import Config

TITLE_NDX = 0
SENTENCES_NDX = 1
VEC_DOC_NDX = 2


class Storage:
    def __init__(self, ):
        self.database: Database = Database(Config.db_connection)
        self.docs: Dict[int, Tuple[str, List[str], np.ndarray]] = {}  # doc_id: title, list_of_sentences, vec_doc
        self.search_cache = {}  # similar sentences cache

    async def create_db(self):
        query = """CREATE TABLE IF NOT EXISTS doc (
        id INTEGER PRIMARY KEY, 
        name TEXT, 
        sentences TEXT, 
        sent_vec TEXT, 
        timestamp TEXT)"""
        await self.database.execute(query=query)

    async def load_data(self):
        """loads all documents
        """
        await self.database.connect()
        try:
            query = """SELECT id, name, sentences, sent_vec, timestamp FROM doc ORDER BY timestamp"""
            rows = await self.database.fetch_all(query=query)
            for doc_id, name_val, sentences_val, sent_vec_val, timestamp in rows:
                title = name_val
                sentences = json.loads(sentences_val)
                sent_vec = json.loads(sent_vec_val)
                sent_vec = np.array(sent_vec)
                self.docs[doc_id] = (title, sentences, sent_vec)
        finally:
            await self.database.disconnect()

    async def connect(self):
        await self.database.connect()

    async def disconnect(self):
        await self.database.disconnect()

    async def add_document(self, title: str, sentences: List[str], doc_vec: np.ndarray) -> int:
        """ add document to db and inner cash
        :return: document id
        """
        self.clear_cache()
        sentences_val: str = json.dumps(sentences)
        sent_vec_val: str = json.dumps(doc_vec.tolist())
        timestamp_val: str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        query = """INSERT INTO doc(name, sentences, sent_vec, timestamp) 
            VALUES (:name, :sentences, :sent_vec, :timestamp)"""

        values = {'name': title,
                  'sentences': sentences_val,
                  'sent_vec': sent_vec_val,
                  'timestamp': timestamp_val}

        doc_id: int = await self.database.execute(query=query, values=values)
        self.docs[doc_id] = (title, sentences, doc_vec)
        return doc_id

    def get_titles(self) -> List[Dict[str, str]]:
        titles = []
        for doc_id, val in self.docs.items():
            doc_id: int
            title = {'id': doc_id, 'title': val[TITLE_NDX]}
            titles.append(title)

        return titles

    def get_number_of_pages(self) -> int:
        number_of_docs = len(self.docs)
        page_size = Config.page_size
        pages = number_of_docs // page_size + (1 if number_of_docs % page_size else 0)
        return pages

    def get_titles_page(self, page_num: int) -> List[Dict[str, str]]:
        """ returns document titles, split by pages
        :param page_num: page number, starts from 1
        :return:
        """
        page_size = Config.page_size
        pages_cnt: int = self.get_number_of_pages()
        if page_num < 1:
            page_num = 1

        if page_num > pages_cnt:
            page_num = pages_cnt

        start_from = (page_num - 1) * page_size
        end_to = page_num * page_size
        titles = []
        for i, (doc_id, val) in enumerate(self.docs.items()):  # in python 3.7 dictionaries are ordered
            doc_id: int
            if start_from <= i < end_to:
                title = {'id': doc_id, 'title': val[TITLE_NDX]}
                titles.append(title)

        return titles

    def get_doc_sentences(self, doc_id: int) -> List[Dict[str, Union[int, str]]]:
        sentences: List[str] = self.docs[doc_id][1]
        sent_with_keys = []
        for i, v in enumerate(sentences):
            s = {'id': i, 'content': v}
            sent_with_keys.append(s)
        return sent_with_keys

    def get_sente_vec(self, doc_id: int, sentence_id: int) -> np.ndarray:
        doc_vec = self.docs[doc_id][VEC_DOC_NDX]
        sente_vec = doc_vec[sentence_id, :]
        return sente_vec

    def search_similar(self, doc_id: int, sentence_id: int) -> List[Dict[str, Union[int, str]]]:
        """search similar sentences
        :param docId:
        :param sentenceId:
        :return:list of dict: {doc_id, sentence_id, sentence_value}
        """

        similarity_list = self.get_cache((doc_id, sentence_id))
        if similarity_list:
            return similarity_list

        sente_vec: np.ndarray = self.get_sente_vec(doc_id, sentence_id)

        similarity_list = []
        for d_id, d in self.docs.items():
            d_id: int
            d: Tuple[str, List[str], np.ndarray]

            if d_id == doc_id:  # do not search in document, from which sentence is
                continue
            doc_vec = d[VEC_DOC_NDX]
            sentences = d[SENTENCES_NDX]
            for s_id in range(doc_vec.shape[0]):
                vec: np.ndarray = doc_vec[s_id, :]
                rate: float = cosine_similarity(sente_vec.reshape(1, -1), vec.reshape(1, -1))[0, 0]
                sentence = sentences[s_id]
                similarity_list.append({'docId': d_id, 'sentenceId': s_id, 'rate': rate, 'content': sentence})

        similarity_list.sort(key=lambda x: x['rate'], reverse=True)
        similarity_list = similarity_list[: Config.number_of_search_items]
        self.add_to_cache((doc_id, sentence_id), similarity_list)
        return similarity_list

    def add_to_cache(self, key, item):
        self.search_cache[key] = item

    def get_cache(self, key):
        return self.search_cache.get(key, None)

    def clear_cache(self):
        self.search_cache = {}

    def get_doc_as_text(self, doc_id: int):
        sentences = self.docs[doc_id][SENTENCES_NDX]
        doc = ''.join(sentences)
        return doc
