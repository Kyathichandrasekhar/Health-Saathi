"""Recommendation service — doctor/hospital recommendations"""


def recommend_specialist(symptoms: list[str]) -> dict:
    """Recommend a specialist based on symptoms"""
    symptom_to_specialty = {
        "fever": "General",
        "cold": "General",
        "headache": "Neurology",
        "stomach": "Gastroenterology",
        "heart": "Cardiology",
        "bone": "Orthopedics",
        "skin": "Dermatology",
        "eye": "Ophthalmology",
        "ear": "ENT",
        "child": "Pediatrics",
    }

    recommended = set()
    for symptom in symptoms:
        s_lower = symptom.lower()
        for key, specialty in symptom_to_specialty.items():
            if key in s_lower:
                recommended.add(specialty)

    if not recommended:
        recommended.add("General")

    return {
        "symptoms": symptoms,
        "recommended_specialties": list(recommended),
    }
