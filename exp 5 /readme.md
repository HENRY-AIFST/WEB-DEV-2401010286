# 📝 Simple Blog (Flask CRUD Application)

## 📌 Project Overview

This project is a **Simple Blog Web Application** built using the Flask framework in Python.
It allows users to perform basic **CRUD operations** (Create, Read, Update, Delete) on blog posts without using a database.

---

## 👨‍💻 Developed By

**Name:** Rahul Bagoria
**Course:** B.Tech CSE
**Experiment:** Experiment-5 (Flask CRUD Blog)

---

## 🚀 Features

* ➕ Create new blog posts
* 📖 View all blog posts
* ✏️ Edit existing posts
* ❌ Delete posts
* 🧭 Simple navigation (Home, Create Post)
* 🎨 Basic styling using CSS

---

## 🛠️ Technologies Used

* Python
* Flask
* HTML (Jinja2 Templates)
* CSS

---

## 📁 Project Structure

```
simple_blog/
│
├── app.py
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── create.html
│   ├── edit.html
│
└── static/
    └── style.css
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <your-repo-link>
cd simple_blog
```

### 2️⃣ (Optional) Create Virtual Environment

```
python -m venv venv
venv\Scripts\activate
```

### 3️⃣ Install Dependencies

```
pip install flask
```

### 4️⃣ Run Application

```
python app.py
```

### 5️⃣ Open in Browser

```
http://127.0.0.1:5000/
```

---

## 🧠 How It Works

* Blog posts are stored in a **Python list (temporary memory)**
* Flask routes handle CRUD operations:

  * `/` → Display posts
  * `/create` → Add new post
  * `/edit/<index>` → Update post
  * `/delete/<index>` → Delete post
* Templates are rendered using `render_template()`

---

## 📸 Screenshots

(Add screenshots here before submission)

* Home Page
* Create/Edit Page

---

## ⚠️ Limitations

* No database (data is lost when server restarts)
* No user authentication

---

## 📚 References

* Flask Documentation: https://flask.palletsprojects.com/
* W3Schools Flask Tutorial

---

## 📢 Academic Integrity

This project is developed individually for academic purposes.
No unauthorized copying has been done.

---

## ✅ Conclusion

This project demonstrates basic understanding of **Flask routing, templates, and CRUD operations**, which are essential for web development.

---
