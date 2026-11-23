"""
Redis Caching Layer for SmogShield AI.
Implements 15-minute TTL caching for spatial AQI snapshots, 96-hour forecast timelines,
and static map tiles, absorbing traffic spikes during severe winter smog episodes.
Falls back gracefully to an in-memory TTL cache if Redis server is unreachable.
"""

import os
import json
import time
from typing import Optional, Any
from app.config import settings

class CacheEngine:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.default_ttl = settings.CACHE_TTL_MINUTES * 60  # 15 minutes = 900 seconds
        self._memory_cache: dict[str, tuple[float, str]] = {}
        self._redis_client = None
        self._init_redis()

    def _init_redis(self):
        try:
            import redis
            self._redis_client = redis.Redis.from_url(
                self.redis_url,
                decode_responses=True,
                socket_connect_timeout=1.5
            )
            # Test ping
            self._redis_client.ping()
        except Exception:
            # Graceful fallback to in-memory cache
            self._redis_client = None

    def get(self, key: str) -> Optional[Any]:
        """Retrieves cached data if not expired."""
        if self._redis_client:
            try:
                val = self._redis_client.get(key)
                if val:
                    return json.loads(val)
            except Exception:
                pass

        # Fallback to memory cache
        if key in self._memory_cache:
            expires_at, val = self._memory_cache[key]
            if time.time() < expires_at:
                return json.loads(val)
            else:
                del self._memory_cache[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> bool:
        """Stores data in cache with TTL (defaults to 15 minutes)."""
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        serialized = json.dumps(value)

        if self._redis_client:
            try:
                self._redis_client.setex(key, ttl, serialized)
                return True
            except Exception:
                pass

        # Fallback to memory cache
        expires_at = time.time() + ttl
        self._memory_cache[key] = (expires_at, serialized)
        return True

    def delete(self, key: str):
        """Invalidates a cache key."""
        if self._redis_client:
            try:
                self._redis_client.delete(key)
            except Exception:
                pass
        self._memory_cache.pop(key, None)

cache = CacheEngine()
