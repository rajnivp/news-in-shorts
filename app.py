from flask import Flask, render_template, url_for, request, jsonify, redirect, abort
from modules.news import *
from modules.models import *
from datetime import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///messages.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

Query = [None]

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        start = int(request.form.get('start'))
        end = int(request.form.get('end'))
        contents = news_pooling_cat(cat=None, page=end // 12)
        return jsonify(contents)
    else:
        return render_template('index.html')


@app.route('/<href>', methods=['GET', 'POST'])
def news_categories(href):
    categories = ["business", "entertainment", "health", "science", "sports", "technology"]
    if href in categories:
        if request.method == 'POST':
            start = int(request.form.get('start'))
            end = int(request.form.get('end'))
            contents = news_pooling_cat(cat=href, page=end // 12)
            return jsonify(contents)
        else:
            return render_template('index.html')
    else:
        abort(404)


@app.route('/search', methods=['GET', 'POST'])
def search():
    query = request.args.get('q')
    if query:
        Query.insert(0, query)
        if len(Query) > 1:
            del Query[1:]

    if request.method == 'POST':
        start = int(request.form.get('start'))
        end = int(request.form.get('end'))
        search_query = request.form.get('query')
        if search_query:
            contents = news_pooling(search_query, end // 12)
        elif Query[0]:
            contents = news_pooling(Query[0], (end + 12) // 12)
        else:
            contents = news_pooling_cat(cat=None, page=(end + 12) // 12)

        return jsonify(contents)

    else:

        return render_template('index.html')


@app.route('/about', methods=['GET', 'POST'])
def about():
    if request.method == "POST":
        name = request.form.get('name')
        email = request.form.get('name')
        phone = request.form.get('name')
        recieved_message = request.form.get('message')
        message = Messages(email=email, name=name, phone=phone, message=recieved_message, time=datetime.now())
        db.session.add(message)
        db.session.commit()
        return jsonify("message sent successfully")

    return render_template('about.html')


if __name__ == "__main__":
    app.run()

