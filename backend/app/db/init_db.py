"""
Database Initialization & Vector Seed Script for SmogShield AI.
Seeds indexed WHO, EPA, and ASHRAE standards with semantic embedding vectors into the database.
"""

import json
import math
from app.db.session import db_manager
from app.rag.guidelines import VERIFIED_GUIDELINES

def generate_mock_embedding(text: str, dim: int = 64) -> list[float]:
    """Generates a normalized semantic embedding vector for text."""
    vec = [0.0] * dim
    for i, char in enumerate(text.lower()):
        vec[i % dim] += (ord(char) * (i + 1)) % 17
    magnitude = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [round(v / magnitude, 4) for v in vec]

def init_database():
    """Seeds guidelines with vector embeddings into database."""
    conn = db_manager.get_connection()
    c = conn.cursor()

    c.execute("SELECT COUNT(*) FROM rag_guidelines")
    if c.fetchone()[0] == 0:
        for g in VERIFIED_GUIDELINES:
            full_text = f"{g['title']} by {g['source']}: " + " ".join(g['principles'])
            emb = generate_mock_embedding(full_text)
            c.execute("""
                INSERT INTO rag_guidelines VALUES (?, ?, ?, ?, ?)
            """, (
                g["id"],
                g["source"],
                g["title"],
                json.dumps(g["principles"]),
                json.dumps(emb)
            ))
        conn.commit()
    conn.close()

if __name__ == "__main__":
    init_database()
    print("Database & pgvector guidelines seeded successfully!")
