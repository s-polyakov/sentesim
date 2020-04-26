from typing import Dict, Tuple, List
import json
import argparse

from aiohttp import web
import aiohttp_cors
import numpy as np
from gensim.models.word2vec import Word2Vec

from config import Config
from storage import Storage
from lang_processor import tokenaze_sentences, preprocess_doc, vectorize_corpus


routes = web.RouteTableDef()


@routes.get("/")
async def home(request):
    return web.Response(text="Search of the similar sentences")


@routes.get("/doctext")
async def get_doc_text(request):
    doc_id = int(request.query["docId"])
    storage = request.app['storage']
    doc_text: str = storage.get_doc_as_text(doc_id)
    return web.json_response({'docText': doc_text})


@routes.get("/search")
async def search(request):
    doc_id = int(request.query["docId"])
    sentence_id = int(request.query["sentenceId"])
    storage = request.app['storage']
    similar_sentences = storage.search_similar(doc_id, sentence_id)
    page_size = Config.page_size
    return web.json_response({'sentences': similar_sentences,
                              'pageSize': page_size})


@routes.get("/document_sentences")
async def get_document(request):
    storage = request.app['storage']
    doc_id = int(request.query["docId"])
    sentences = storage.get_doc_sentences(doc_id)
    page_size = Config.page_size
    return web.json_response({'sentences': sentences, 'pageSize': page_size})


@routes.get("/doc_titles")
async def get_doc_titles(request):
    storage = request.app['storage']
    titles = storage.get_titles()
    return web.json_response({'doc_titles': titles})


@routes.get("/doc_titles_page")
async def get_doc_titles_page(request):
    storage = request.app['storage']
    page_num = int(request.query["pageNum"])
    titles = storage.get_titles_page(page_num)
    return web.json_response({'doc_titles': titles})


@routes.get("/number_of_pages")
def get_number_of_pages(request):
    storage = request.app['storage']
    number_of_pages = storage.get_number_of_pages()
    return web.json_response({'numberOfPages': number_of_pages})


@routes.post("/add")
async def add_document(request):
    storage: Storage = request.app['storage']
    await storage.connect()
    not_found_words = []
    doc_id = 0
    name_val = ''
    try:
        request_data = await request.content.read(n=-1)
        data: str = request_data.decode("utf-8")
        data_decoded: dict = json.loads(data)
        doc = data_decoded['doc']
        sentences: List[str] = tokenaze_sentences(doc)
        corpus: List[List[str]] = preprocess_doc(sentences)
        model = request.app['model']
        doc_vec: np.ndarray
        not_found_words: List[str]
        doc_vec, not_found_words = vectorize_corpus(corpus, model)
        title: str = doc[: 200]
        doc_id = await storage.add_document(title, sentences, doc_vec)
    finally:
        await storage.disconnect()

    return web.json_response({'docId': doc_id, 'title': title, 'notFoundWords': not_found_words})


async def on_startup(app):
    storage = Storage()
    await storage.create_db()
    await storage.load_data()
    app['storage'] = storage
    model = Word2Vec.load('model_text8')  # TODO: Is it possible to load async?
    app['model']: Word2Vec = model


async def on_cleanup(app):
    pass


app = web.Application()
app.add_routes(routes)

cors = aiohttp_cors.setup(app, defaults={
    Config.client_url: aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
})

# Configure CORS on all routes.
for route in list(app.router.routes()):
    cors.add(route)


app.on_startup.append(on_startup)
app.on_cleanup.append(on_cleanup)
app.add_routes(routes)
