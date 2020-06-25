from newsapi import NewsApiClient
from newspaper import Article
from multiprocessing.dummy import Pool
import os

news_api_key = os.getenv('API_KEY')

newsapi = NewsApiClient(api_key=news_api_key)


def fetch_news(query, page=1):
    top_headlines = newsapi.get_everything(q=query,
                                           page_size=8,
                                           page=page,
                                           sort_by="relevancy"
                                           )

    results = top_headlines['articles']

    return results


def get_top_news(category, page):
    top_news = newsapi.get_top_headlines(page_size=8,
                                         category=category,
                                         page=page)
    results = top_news['articles']

    return results


def news_processing(news):
    try:
        res = dict()
        article = Article(news['url'])
        article.download()
        article.parse()
        article.nlp()
        res['name'] = news['source']['name']
        res['title'] = news['title']
        res['image'] = news['urlToImage']
        res['time'] = news['publishedAt'].split('T')[0]
        res['url'] = news['url']
        res['summary'] = article.summary

        return res

    except:

        return False


def news_pooling(query, page=1, search=False):
    if search:
        news_list = fetch_news(query, page)
    else:
        news_list = get_top_news(query, page)
    with Pool(10) as pool:
        res = pool.map(news_processing, news_list)
        pool.close()
        pool.join()

    news_set = set()
    new_news_list = []
    res = [value for value in res if value]
    for news in res:
        t = news['title']
        if t not in news_set:
            news_set.add(t)
            new_news_list.append(news)

    return new_news_list
