"""Health assistant service — structured RMP-style triage and guidance."""

from __future__ import annotations

import re


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
    "vomiting blood",
    "black stool",
    "one side weakness",
    "slurred speech",
]

SEVERITY_WORDS = {
    "mild": ["mild", "light"],
    "moderate": ["moderate", "medium"],
    "severe": ["severe", "very severe", "worst", "unbearable"],
}


SYMPTOM_DB = {
    "fever": {
        "keywords": ["fever", "temperature", "hot", "chills", "shivering"],
        "likely_causes": ["viral fever", "flu", "seasonal infection"],
        "home_care": [
            "Rest and drink enough fluids (water/ORS)",
            "Use paracetamol only as per label or doctor advice",
            "Monitor temperature every 6 to 8 hours",
        ],
        "red_flags": ["Fever above 102 F for more than 48 hours", "Breathing trouble", "Persistent vomiting"],
        "specialist": "General Physician",
        "suggestions": ["Cold & cough", "Body pain", "Headache", "Book appointment"],
    },
    "respiratory": {
        "keywords": ["cold", "cough", "sore throat", "runny nose", "sneezing", "congestion", "phlegm"],
        "likely_causes": ["viral upper respiratory infection", "allergy", "throat irritation"],
        "home_care": [
            "Warm fluids and steam inhalation",
            "Salt-water gargle if throat pain is present",
            "Take proper rest and avoid smoke/dust",
        ],
        "red_flags": ["Wheezing", "High fever with cough", "Symptoms worsening after 5 to 7 days"],
        "specialist": "General Physician / ENT",
        "suggestions": ["Fever", "Allergy", "Headache", "Book appointment"],
    },
    "headache": {
        "keywords": ["headache", "migraine", "head pain", "throbbing", "head hurts"],
        "likely_causes": ["dehydration", "migraine", "stress", "eye strain"],
        "home_care": [
            "Hydrate and rest in a calm room",
            "Reduce screen exposure for a few hours",
            "Use simple pain-relief tablet only if safe for you",
        ],
        "red_flags": ["Sudden worst headache", "Neck stiffness", "Repeated vomiting or confusion"],
        "specialist": "General Physician / Neurologist",
        "suggestions": ["Eye strain", "Stress", "Fever", "Book appointment"],
    },
    "stomach": {
        "keywords": ["stomach", "acidity", "gas", "bloating", "nausea", "vomiting", "diarrhea", "loose motion"],
        "likely_causes": ["gastritis", "food infection", "food intolerance"],
        "home_care": [
            "Take light bland meals",
            "Drink ORS/water in small frequent sips",
            "Avoid spicy and oily food for 24 to 48 hours",
        ],
        "red_flags": ["Blood in vomit/stool", "Severe dehydration", "Persistent severe pain"],
        "specialist": "General Physician / Gastroenterologist",
        "suggestions": ["Acidity", "Vomiting", "Food poisoning", "Book appointment"],
    },
    "skin": {
        "keywords": ["allergy", "rash", "itching", "hives", "eczema", "skin"],
        "likely_causes": ["allergic reaction", "irritant dermatitis", "skin inflammation"],
        "home_care": [
            "Avoid known trigger products/foods",
            "Use mild moisturizer and keep skin cool",
            "Do not scratch affected area",
        ],
        "red_flags": ["Lip or tongue swelling", "Breathing issues", "Fast spreading rash with fever"],
        "specialist": "Dermatologist / Allergist",
        "suggestions": ["Cold", "Eye allergy", "Itching", "Book appointment"],
    },
    "muscle_joint": {
        "keywords": ["back pain", "body pain", "joint pain", "muscle pain", "sprain", "neck pain"],
        "likely_causes": ["muscle strain", "posture-related pain", "overuse"],
        "home_care": [
            "Rest and avoid heavy activity",
            "Apply hot/cold compress for 15 to 20 minutes",
            "Start gentle stretching after pain eases",
        ],
        "red_flags": ["Weakness/numbness", "Pain after trauma", "Pain not improving for 1 week"],
        "specialist": "Orthopedic",
        "suggestions": ["Back pain", "Joint pain", "Fever", "Book appointment"],
    },
    "mental_health": {
        "keywords": ["stress", "anxiety", "panic", "depressed", "sad", "sleep", "insomnia"],
        "likely_causes": ["stress overload", "sleep disturbance", "anxiety symptoms"],
        "home_care": [
            "Do slow deep breathing for 5 to 10 minutes",
            "Follow fixed sleep and wake schedule",
            "Limit caffeine and late-night screens",
        ],
        "red_flags": ["Self-harm thoughts", "Panic episodes with breathlessness", "Daily function severely affected"],
        "specialist": "Psychologist / Psychiatrist",
        "suggestions": ["Sleep issues", "Headache", "Stress", "Book appointment"],
    },
}


def _normalize(text: str) -> str:
    return " ".join(text.lower().strip().split())


def _match_score(message: str, keywords: list[str]) -> int:
    return sum(1 for keyword in keywords if keyword in message)


def _is_emergency(message: str) -> bool:
    return any(keyword in message for keyword in EMERGENCY_KEYWORDS)


def _extract_duration_days(message: str) -> int | None:
    pattern = re.search(r"(\d+)\s*(day|days|week|weeks)", message)
    if not pattern:
        return None

    count = int(pattern.group(1))
    unit = pattern.group(2)
    if "week" in unit:
        return count * 7
    return count


def _extract_age(message: str) -> int | None:
    patterns = [
        r"(\d{1,3})\s*(years|year|yrs|yr)\s*old",
        r"age\s*(\d{1,3})",
    ]

    for pattern in patterns:
        match = re.search(pattern, message)
        if match:
            age = int(match.group(1))
            if 0 < age < 120:
                return age
    return None


def _extract_severity(message: str) -> str | None:
    for label, words in SEVERITY_WORDS.items():
        if any(word in message for word in words):
            return label
    return None


def _build_followups(age: int | None, duration_days: int | None, severity: str | None) -> list[str]:
    questions: list[str] = []
    if duration_days is None:
        questions.append("How many days this problem has been present?")
    if severity is None:
        questions.append("Is it mild, moderate, or severe?")
    if age is None:
        questions.append("Please share patient age (approx).")
    return questions


def _medicine_safety_line(age: int | None) -> str:
    if age is not None and age < 12:
        return "For children, avoid self-medication doses. Please consult pediatric advice before giving medicines."
    if age is not None and age >= 60:
        return "For age 60+, keep medicine doses conservative and review BP/sugar/comorbidity interactions with a doctor."
    return "Do not start antibiotics or steroid medicines without a doctor prescription."


def _build_structured_reply(
    primary_category: str,
    primary_data: dict,
    secondary_categories: list[str],
    age: int | None,
    duration_days: int | None,
    severity: str | None,
) -> str:
    likely_causes = ", ".join(primary_data["likely_causes"])
    home_care = "\n".join(f"- {item}" for item in primary_data["home_care"])
    red_flags = "\n".join(f"- {item}" for item in primary_data["red_flags"])

    context_bits = []
    if age is not None:
        context_bits.append(f"age: {age}")
    if duration_days is not None:
        context_bits.append(f"duration: {duration_days} day(s)")
    if severity is not None:
        context_bits.append(f"severity: {severity}")
    context_line = ", ".join(context_bits) if context_bits else "limited details provided"

    secondary_line = ""
    if secondary_categories:
        secondary_readable = ", ".join(category.replace("_", " ") for category in secondary_categories)
        secondary_line = f"\n**Also consider:** {secondary_readable}\n"

    return (
        "**Basic RMP-style Triage (point-wise):**\n"
        f"1. **Case summary:** {context_line}\n"
        f"2. **Primary symptom group:** {primary_category.replace('_', ' ').title()}\n"
        f"3. **Likely causes:** {likely_causes}\n"
        f"{secondary_line}"
        f"4. **What to do now:**\n{home_care}\n"
        f"5. **Recommended specialist:** {primary_data['specialist']}\n"
        f"6. **Go to hospital urgently if:**\n{red_flags}\n"
        f"7. **Medicine safety note:** {_medicine_safety_line(age)}\n"
        "8. **Note:** This is educational support, not a confirmed diagnosis."
    )


def get_health_response(message: str) -> dict:
    """Analyze user symptoms and provide structured triage guidance."""
    msg_lower = _normalize(message)

    if not msg_lower:
        return {
            "reply": (
                "**Please share details in points:**\n"
                "1. Main symptom\n"
                "2. Duration (days)\n"
                "3. Severity (mild/moderate/severe)\n"
                "4. Age\n"
                "Example: Fever for 2 days, moderate, age 28."
            ),
            "suggestions": ["Fever", "Cold & cough", "Headache", "Stomach pain", "Book appointment"],
        }

    if _is_emergency(msg_lower):
        return {
            "reply": (
                "**Emergency Alert:**\n"
                "1. This may be an emergency.\n"
                "2. Go to nearest emergency hospital now or call local emergency services.\n"
                "3. Do not rely only on chat for severe chest pain, breathlessness, seizures, heavy bleeding, or stroke signs."
            ),
            "suggestions": ["Call emergency", "Nearest hospital", "Book appointment", "Share more symptoms"],
        }

    if any(word in msg_lower for word in ["book", "appointment", "doctor", "hospital"]):
        return {
            "reply": (
                "**Booking Guidance:**\n"
                "1. Share symptom + duration + severity + age.\n"
                "2. I will suggest the right specialist.\n"
                "3. Then use Book page to confirm appointment."
            ),
            "suggestions": ["General Physician", "Dermatologist", "ENT", "Orthopedic", "Book appointment"],
        }

    age = _extract_age(msg_lower)
    duration_days = _extract_duration_days(msg_lower)
    severity = _extract_severity(msg_lower)

    ranked = []
    for category, data in SYMPTOM_DB.items():
        score = _match_score(msg_lower, data["keywords"])
        if score > 0:
            ranked.append((score, category, data))

    if not ranked:
        followups = _build_followups(age, duration_days, severity)
        followup_text = "\n".join(f"- {item}" for item in followups)
        return {
            "reply": (
                "**I need more details for accurate triage:**\n"
                f"{followup_text if followup_text else '- Main symptom details'}"
            ),
            "suggestions": ["Fever", "Cold & cough", "Headache", "Stomach pain", "Skin rash"],
        }

    ranked.sort(key=lambda item: item[0], reverse=True)
    _, primary_category, primary_data = ranked[0]
    secondary_categories = [item[1] for item in ranked[1:3]]

    reply = _build_structured_reply(
        primary_category=primary_category,
        primary_data=primary_data,
        secondary_categories=secondary_categories,
        age=age,
        duration_days=duration_days,
        severity=severity,
    )

    followups = _build_followups(age, duration_days, severity)
    if followups:
        reply = reply + "\n\n**9. To improve accuracy, please also tell:**\n" + "\n".join(
            f"- {question}" for question in followups
        )

    return {
        "reply": reply,
        "suggestions": primary_data["suggestions"],
    }
