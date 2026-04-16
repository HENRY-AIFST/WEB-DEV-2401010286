"""
Project Title: Simple Blog (Flask CRUD)
Name: Rahul Bagoria
Date: 2026
Description: A basic blog application using Flask with Create, Read, Update, Delete operations.
"""

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Temporary storage (No database)
posts = []

# HOME (Read)
@app.route('/')
def index():
    return render_template('index.html', posts=posts)

# CREATE
@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        posts.append({'title': title, 'content': content})
        return redirect(url_for('index'))
    return render_template('create.html')

# UPDATE
@app.route('/edit/<int:index>', methods=['GET', 'POST'])
def edit(index):
    post = posts[index]

    if request.method == 'POST':
        post['title'] = request.form['title']
        post['content'] = request.form['content']
        return redirect(url_for('index'))

    return render_template('edit.html', post=post, index=index)

# DELETE
@app.route('/delete/<int:index>')
def delete(index):
    posts.pop(index)
    return redirect(url_for('index'))

# RUN
if __name__ == '__main__':
    app.run(debug=True)
