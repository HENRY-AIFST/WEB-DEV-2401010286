# ============================================================
# Project Title : Contact Management System — Next Level
# Name          : Flask Developer
# Date          : 2026-04-23
# Description   : Full CRUD Flask app with in-memory storage,
#                 input validation, search, and flash messages.
# ============================================================

from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "nexlevel_contact_secret_2026"

# ── In-Memory Data Store ─────────────────────────────────────
contacts = [
    {"id": 1, "name": "Aria Chen",    "phone": "+91 98765 43210", "email": "aria.chen@nexus.io",      "role": "Product Designer"},
    {"id": 2, "name": "Kiran Mehta",  "phone": "+91 87654 32109", "email": "kiran.m@starlabs.dev",    "role": "Senior Engineer"},
    {"id": 3, "name": "Sofia Reyes",  "phone": "+91 76543 21098", "email": "sofia.r@orbital.co",      "role": "Marketing Lead"},
    {"id": 4, "name": "Liam Torres",  "phone": "+91 65432 10987", "email": "liam.t@fusiontech.com",   "role": "Data Scientist"},
    {"id": 5, "name": "Yuna Park",    "phone": "+91 54321 09876", "email": "yuna.park@cloudvault.ai", "role": "DevOps Engineer"},
]
next_id = 6


def find_contact(contact_id):
    for c in contacts:
        if c["id"] == contact_id:
            return c
    return None


@app.route("/")
def index():
    query = request.args.get("q", "").strip().lower()
    if query:
        results = [c for c in contacts
                   if query in c["name"].lower()
                   or query in c["phone"]
                   or query in c["email"].lower()
                   or query in c.get("role", "").lower()]
    else:
        results = contacts
    return render_template("index.html", contacts=results, query=query, total=len(contacts))


@app.route("/add", methods=["GET", "POST"])
def add_contact():
    global next_id
    if request.method == "POST":
        name  = request.form.get("name",  "").strip()
        phone = request.form.get("phone", "").strip()
        email = request.form.get("email", "").strip()
        role  = request.form.get("role",  "").strip()

        errors = []
        if not name:  errors.append("Full name is required.")
        if not phone: errors.append("Phone number is required.")
        if not email: errors.append("Email address is required.")

        if errors:
            for e in errors:
                flash(e, "error")
            return render_template("add_contact.html",
                                   name=name, phone=phone, email=email, role=role)

        contacts.append({"id": next_id, "name": name,
                         "phone": phone, "email": email, "role": role})
        next_id += 1
        flash(f'✦ {name} has been added to your contacts.', "success")
        return redirect(url_for("index"))

    return render_template("add_contact.html", name="", phone="", email="", role="")


@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit_contact(id):
    contact = find_contact(id)
    if not contact:
        flash("Contact not found.", "error")
        return redirect(url_for("index"))

    if request.method == "POST":
        name  = request.form.get("name",  "").strip()
        phone = request.form.get("phone", "").strip()
        email = request.form.get("email", "").strip()
        role  = request.form.get("role",  "").strip()

        errors = []
        if not name:  errors.append("Full name is required.")
        if not phone: errors.append("Phone number is required.")
        if not email: errors.append("Email address is required.")

        if errors:
            for e in errors:
                flash(e, "error")
            return render_template("edit_contact.html",
                                   contact={"id": id, "name": name,
                                            "phone": phone, "email": email, "role": role})

        contact.update({"name": name, "phone": phone, "email": email, "role": role})
        flash(f'✦ {name} has been updated.', "success")
        return redirect(url_for("index"))

    return render_template("edit_contact.html", contact=contact)


@app.route("/delete/<int:id>")
def delete_contact(id):
    contact = find_contact(id)
    if not contact:
        flash("Contact not found.", "error")
        return redirect(url_for("index"))
    name = contact["name"]
    contacts.remove(contact)
    flash(f'✦ {name} has been removed.', "success")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
