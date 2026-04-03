"""Health assistant service — symptom-aware triage and guidance engine."""

from __future__ import annotations


EMERGENCY_KEYWORDS = [
    "chest pain",
    "cannot breathe",
    "can not breathe",
    "difficulty breathing",
    "shortness of breath",
    "fainted",
    "unconscious",
    "stroke",
    "seizure",
    "suicidal",
    "severe bleeding",
    "blood vomiting",
]


SYMPTOM_DB = {
    "fever": {
        "keywords": ["fever", "temperature", "hot", "chills", "shivering"],
        "likely_causes": ["viral infection", "flu", "seasonal infection"],
        "home_care": [
            "Rest well and stay hydrated",
            "Use paracetamol as advised on label",
            "Use light clothing and cool compress",
        ],
        "foods": ["ORS", "coconut water", "soups", "khichdi"],
        "red_flags": ["Fever > 102 F for 48 hours", "Breathing difficulty", "Persistent vomiting"],
        "specialist": "General Physician",
        "suggestions": ["Headache", "Body pain", "Cold & cough", "Book appointment"],
    },
    "cold": {
        "keywords": ["cold", "cough", "sore throat", "runny nose", "sneezing", "congestion"],
        "likely_causes": ["viral upper respiratory infection", "allergic rhinitis"],
        "home_care": [
            "Warm fluids and steam inhalation",
            "Salt-water gargle for throat discomfort",
            "Adequate sleep and hydration",
        ],
        "foods": ["ginger tea", "turmeric milk", "warm soup", "honey lemon water"],
        "red_flags": ["Symptoms > 7 days", "Wheezing", "High fever with cough"],
        "specialist": "General Physician / ENT",
        "suggestions": ["Fever", "Headache", "Allergy", "Book appointment"],
    },
    "headache": {
        "keywords": ["headache", "migraine", "head pain", "head hurts", "throbbing"],
        "likely_causes": ["dehydration", "migraine", "stress", "eye strain"],
        "home_care": [
            "Rest in a dim, quiet room",
            "Hydrate and avoid skipping meals",
            "Use simple pain reliever if suitable",
        ],
        "foods": ["water", "bananas", "nuts", "light meals"],
        "red_flags": ["Sudden worst headache", "Neurological symptoms", "Repeated vomiting"],
        "specialist": "General Physician / Neurologist",
        "suggestions": ["Fever", "Stress", "Eye strain", "Book appointment"],
    },
    "stomach": {
        "keywords": ["stomach", "digestion", "acidity", "gas", "bloating", "nausea", "vomiting", "diarrhea"],
        "likely_causes": ["gastritis", "food intolerance", "mild stomach infection"],
        "home_care": [
            "Eat bland meals and avoid oily/spicy food",
            "Drink clean fluids in small frequent sips",
            "Try oral rehydration if loose motions",
        ],
        "foods": ["banana", "curd", "rice", "toast", "jeera water"],
        "red_flags": ["Blood in stool/vomit", "Severe dehydration", "Persistent pain > 24 hours"],
        "specialist": "General Physician / Gastroenterologist",
        "suggestions": ["Food poisoning", "Acidity", "Bloating", "Book appointment"],
    },
    "stress": {
        "keywords": ["stress", "anxiety", "worried", "panic", "sleep", "insomnia", "depression", "sad"],
        "likely_causes": ["stress overload", "sleep disruption", "anxiety symptoms"],
        "home_care": [
            "Practice deep breathing for 5-10 minutes",
            "Reduce evening screen exposure",
            "Daily walk and fixed sleep schedule",
        ],
        "foods": ["warm milk", "nuts", "bananas", "balanced meals"],
        "red_flags": ["Self-harm thoughts", "Panic attacks", "Severe functional impairment"],
        "specialist": "Psychologist / Psychiatrist",
        "suggestions": ["Headache", "Fatigue", "Sleep issues", "Book appointment"],
    },
    "pain": {
        "keywords": ["back pain", "body pain", "muscle", "joint", "sprain", "cramp", "neck pain"],
        "likely_causes": ["muscle strain", "posture related pain", "overuse"],
        "home_care": [
            "Rest the affected area and avoid strain",
            "Hot/cold compress for 15-20 minutes",
            "Gentle stretching after acute pain settles",
        ],
        "foods": ["turmeric", "ginger", "protein-rich meals", "omega-3 foods"],
        "red_flags": ["Numbness/weakness", "Trauma-related severe pain", "Pain > 1 week"],
        "specialist": "Orthopedic",
        "suggestions": ["Joint pain", "Exercise tips", "Fever", "Book appointment"],
    },
    "allergy": {
        "keywords": ["allergy", "rash", "itching", "hives", "skin", "eczema"],
        "likely_causes": ["allergic reaction", "irritant exposure", "atopic skin response"],
        "home_care": [
            "Avoid known triggers and harsh products",
            "Use mild moisturizer/calamine",
            "Antihistamine may help mild itching",
        ],
        "foods": ["vitamin C fruits", "hydrating foods", "probiotic curd"],
        "red_flags": ["Lip/tongue swelling", "Breathing trouble", "Rapidly spreading rash"],
        "specialist": "Dermatologist / Allergist",
        "suggestions": ["Cold", "Skin infection", "Eye allergy", "Book appointment"],
    },
    "eye": {
        "keywords": ["eye", "vision", "blurry", "eye strain", "redness"],
        "likely_causes": ["digital strain", "dry eyes", "allergic irritation"],
        "home_care": [
            "Follow 20-20-20 screen rule",
            "Use lubricating drops if needed",
            "Avoid rubbing eyes",
        ],
        "foods": ["carrot", "spinach", "eggs", "fish"],
        "red_flags": ["Sudden vision loss", "Severe pain", "Light sensitivity with redness"],
        "specialist": "Ophthalmologist",
        "suggestions": ["Headache", "Screen time tips", "Allergy", "Book appointment"],
    },
}


def _normalize(text: str) -> str:
    return " ".join(text.lower().strip().split())


def _match_score(message: str, keywords: list[str]) -> int:
    return sum(1 for keyword in keywords if keyword in message)


def _is_emergency(message: str) -> bool:
    return any(keyword in message for keyword in EMERGENCY_KEYWORDS)


def _build_structured_reply(category: str, data: dict) -> str:
    likely_causes = ", ".join(data["likely_causes"])
    home_care = "\n".join(f"- {item}" for item in data["home_care"])
    foods = ", ".join(data["foods"])
    red_flags = "\n".join(f"- {item}" for item in data["red_flags"])

    return (
        f"Here is guidance for **{category.title()}** symptoms:\n\n"
        f"**Possible common causes:** {likely_causes}\n\n"
        f"**What you can do now:**\n{home_care}\n\n"
        f"**Helpful foods/fluids:** {foods}\n\n"
        f"**See a doctor urgently if:**\n{red_flags}\n\n"
        f"**Suggested specialist:** {data['specialist']}\n\n"
        "This is general guidance and not a confirmed diagnosis."
    )


def get_health_response(message: str) -> dict:
    """Analyze user message and return health guidance with triage hints."""
    msg_lower = _normalize(message)

    if not msg_lower:
        return {
            "reply": "Please share your symptoms in a bit more detail (for example: fever since 2 days, cough at night, headache after screen use).",
            "suggestions": ["Fever", "Cold & cough", "Headache", "Stomach pain"],
        }

    if _is_emergency(msg_lower):
        return {
            "reply": (
                "Your message may indicate an **urgent condition**. Please seek emergency care immediately or call local emergency services.\n\n"
                "Do not rely on chat advice alone for severe chest pain, breathing trouble, heavy bleeding, seizures, or sudden confusion."
            ),
            "suggestions": ["Call emergency", "Nearest hospital", "Book appointment", "Share more symptoms"],
        }

    if any(word in msg_lower for word in ["book", "appointment", "doctor", "hospital"]):
        return {
            "reply": (
                "You can book an appointment on the **Book** page.\n\n"
                "If you share symptoms and duration, I can suggest the right specialist first."
            ),
            "suggestions": ["General Physician", "Dermatologist", "ENT", "Book appointment"],
        }

    ranked = []
    for category, data in SYMPTOM_DB.items():
        score = _match_score(msg_lower, data["keywords"])
        if score > 0:
            ranked.append((score, category, data))

    if not ranked:
        return {
            "reply": (
                "I can help with common health concerns. Please describe:\n"
                "- Main symptom\n"
                "- Duration\n"
                "- Severity (mild/moderate/severe)\n"
                "- Any fever, breathing issue, or vomiting"
            ),
            "suggestions": ["Fever", "Cold & cough", "Headache", "Stomach pain", "Stress"],
        }

    ranked.sort(key=lambda item: item[0], reverse=True)
    _, category, data = ranked[0]

    return {
        "reply": _build_structured_reply(category, data),
        "suggestions": data["suggestions"],
    }
