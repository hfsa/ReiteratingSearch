# ReiteratingSearch

Runs best on Chrome or Firefox.

Start with entering a search term.  This code will search a text file and return all lines within the text file using that word, then it randomly selects one of the top ten words in the results and initiates a search for that, returns results, picks next search word from the results, and repeat.... 

The text file I've included here are tweets scraped sometime in mid 2016.  In operation, I suggest concurrently running a separate twitter-scraping code in python, rather than have it run from some a static text file.

