from flask import Flask, render_template, request, jsonify
import csv, random

app = Flask(__name__)

# Helper: load CSV into list of dicts
def load_questions(filename):
    qs = []
    with open(filename, newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            qs.append({
                "category": row["category"].strip().lower(),
                "question": row["question"].strip(),
                "answer": row["answer"].strip()
            })
    return qs

# Load all levels
questions = {
    "novice": load_questions("novice.csv"),
    "intermediate": load_questions("intermediate.csv"),
    "advanced": load_questions("advanced.csv")
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_question", methods=["POST"])
def get_question():
    data = request.json
    level = data["level"]
    cats = [c.lower() for c in data["categories"]]

    pool = [q for q in questions[level] if q["category"] in cats] if cats else questions[level]
    if not pool:
        return jsonify({"question": "No questions available", "answer": ""})
    return jsonify(random.choice(pool))

@app.route("/submit_answer", methods=["POST"])
def submit_answer():
    data = request.json
    user = data["answer"].strip().lower()
    correct = data["correct"].strip().lower()
    return jsonify({"result": "correct" if user == correct else "wrong"})

if __name__ == "__main__":
    app.run(debug=True)
