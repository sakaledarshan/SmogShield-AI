"""
Vector Store & Semantic Retrieval Engine for SmogShield AI RAG.
Performs cosine similarity search against indexed WHO, EPA, and ASHRAE guidelines
stored in the database, preventing hallucinated IAQ advice.
"""

import json
import math
from typing import List, Dict, Any
from app.db.session import db_manager
from app.db.init_db import generate_mock_embedding

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Computes cosine similarity between two vectors."""
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1)) or 1.0
    mag2 = math.sqrt(sum(b * b for b in v2)) or 1.0
    return dot / (mag1 * mag2)

def search_rag_guidelines(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Performs cosine vector similarity search against indexed guidelines in database.
    """
    conn = db_manager.get_connection()
    c = conn.cursor()
    try:
        c.execute("SELECT guideline_id, framework, title, content, embedding_json FROM rag_guidelines")
        rows = c.fetchall()
        if not rows:
            return []

        query_emb = generate_mock_embedding(query)
        scored = []

        for row in rows:
            emb = json.loads(row["embedding_json"])
            score = cosine_similarity(query_emb, emb)
            # Keyword relevance booster
            q_words = query.lower().split()
            text_content = (row["title"] + " " + row["content"]).lower()
            keyword_boost = sum(0.12 for w in q_words if w in text_content)
            total_score = score + keyword_boost
            scored.append((total_score, row))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, row in scored[:top_k]:
            results.append({
                "id": row["guideline_id"],
                "title": row["title"],
                "source": row["framework"],
                "principles": json.loads(row["content"]),
                "similarity_score": round(score, 3)
            })
        return results
    finally:
        conn.close()
