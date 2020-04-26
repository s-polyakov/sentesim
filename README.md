This is single page application on React.js, with a aiohttp Python 3.7 backend, which on the main screen show a list of
 downloaded texts and a field where a person in the browser can paste English text from the clipboard.

When loaded, the text is saved and broken into sentences. In the interface, each text will have a unique link that 
displays the document as a list of sentences.

After adding text, the user can see a page of text as a list of sentences.

When you click on a sentence, application finds other texts that contain similar sentences and display the sentences as 
a list sorted by semantic proximity to the selected sentence (from the most similar to the least similar). In the list, 
it displays the sentence itself, a link to the text containing this sentence, the value of the similarity metric. 
The semantic proximity of sentences use word embedding (word2vec).

**See installation.md file for installation instruction**