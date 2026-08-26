import time
from collections import defaultdict, deque
from uuid import UUID

_WINDOW_SECONDS = 3600
_MAX_REQUESTS = 5

_requests: dict[UUID, deque[float]] = defaultdict(deque)


def check_rate_limit(user_id: UUID) -> bool:
    now = time.time()
    timestamps = _requests[user_id]

    while timestamps and timestamps[0] <= now - _WINDOW_SECONDS:
        timestamps.popleft()

    if len(timestamps) >= _MAX_REQUESTS:
        return False

    timestamps.append(now)
    return True
