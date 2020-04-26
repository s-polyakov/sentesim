import gensim.downloader as api
from gensim.models.word2vec import Word2Vec
from multiprocessing import cpu_count


# Download dataset
print('loading...')
dataset = api.load("text8")
data = [d for d in dataset]

# Train Word2Vec model. Defaults result vector size = 100
print('building model...')
model = Word2Vec(data, min_count=0, workers=cpu_count())

# Get the word vector for given word
# print(model['topic'])
# print(model.most_similar('topic'))

# Save Model
print('saving...')
model.save('model_text8')

# model = Word2Vec.load('model_text8')