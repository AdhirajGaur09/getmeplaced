"""
Run this once after setting up your MongoDB to seed sample questions.
Usage: python seed_questions.py
"""
import asyncio
from core.database import init_db
from models.question import Question, Difficulty, QuestionType

QUESTIONS = [
    # ── Google ──────────────────────────────────────────────────────────────
    {
        "title": "Two Sum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "difficulty": Difficulty.easy,
        "question_type": QuestionType.dsa,
        "company": "Google",
        "topic": "Arrays",
        "tags": ["hashmap", "arrays"],
        "hints": ["Use a hash map to store complements.", "One-pass solution exists in O(n)."],
        "solution_approach": "HashMap: for each num, check if target-num exists in map. Store num→index.",
    },
    {
        "title": "LRU Cache",
        "description": "Design a data structure that follows the Least Recently Used (LRU) cache constraints. Implement get and put in O(1).",
        "difficulty": Difficulty.medium,
        "question_type": QuestionType.dsa,
        "company": "Google",
        "topic": "Design",
        "tags": ["linked-list", "hashmap", "design"],
        "hints": ["Combine a doubly linked list with a hashmap.", "Move accessed nodes to the front."],
        "solution_approach": "OrderedDict or manual doubly linked list + dict for O(1) get/put.",
    },
    {
        "title": "Design Google Search Autocomplete",
        "description": "Design a real-time search autocomplete system for Google Search that handles millions of queries per second.",
        "difficulty": Difficulty.hard,
        "question_type": QuestionType.system_design,
        "company": "Google",
        "topic": "System Design",
        "tags": ["trie", "caching", "distributed"],
        "hints": ["Use a Trie with top-k at each node.", "Pre-compute suggestions offline and cache."],
        "solution_approach": "Trie + Redis cache + offline batch processing for top queries per prefix.",
    },
    # ── Amazon ────────────────────────────────────────────────────────────
    {
        "title": "Tell me about a time you had a conflict with a teammate",
        "description": "Amazon Leadership Principle: Earn Trust. Describe a specific situation, your actions, and the outcome.",
        "difficulty": Difficulty.medium,
        "question_type": QuestionType.behavioral,
        "company": "Amazon",
        "topic": "Leadership Principles",
        "tags": ["behavioral", "conflict", "teamwork"],
        "hints": ["Use STAR format: Situation, Task, Action, Result.", "Focus on your actions, not blaming others."],
        "solution_approach": "STAR: Set context → describe disagreement → explain how you approached it → outcome + learnings.",
    },
    {
        "title": "Merge K Sorted Lists",
        "description": "You are given an array of k linked lists, each linked list is sorted in ascending order. Merge all linked lists into one sorted linked list.",
        "difficulty": Difficulty.hard,
        "question_type": QuestionType.dsa,
        "company": "Amazon",
        "topic": "Linked Lists",
        "tags": ["heap", "linked-list", "divide-conquer"],
        "hints": ["Use a min-heap of size k.", "Divide and conquer gives O(N log k) too."],
        "solution_approach": "Min-heap: push first node of each list, pop minimum, push its next.",
    },
    {
        "title": "Design Amazon's Order Management System",
        "description": "Design a scalable order management system for Amazon that handles order placement, payment, fulfillment, and tracking.",
        "difficulty": Difficulty.hard,
        "question_type": QuestionType.system_design,
        "company": "Amazon",
        "topic": "System Design",
        "tags": ["microservices", "event-driven", "databases"],
        "hints": ["Break into microservices: Order, Payment, Inventory, Notification.", "Use event queues (Kafka/SQS) between services."],
        "solution_approach": "Event-driven microservices with SQS for async, DynamoDB for orders, RDS for inventory.",
    },
    # ── Microsoft ────────────────────────────────────────────────────────
    {
        "title": "Binary Tree Level Order Traversal",
        "description": "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        "difficulty": Difficulty.medium,
        "question_type": QuestionType.dsa,
        "company": "Microsoft",
        "topic": "Trees",
        "tags": ["bfs", "trees", "queue"],
        "hints": ["Use a queue (BFS).", "Track level size to group results."],
        "solution_approach": "BFS with deque. For each level, process all nodes, collect values, enqueue children.",
    },
    {
        "title": "What is a deadlock and how do you prevent it?",
        "description": "Explain deadlock in OS, its four necessary conditions (Coffman conditions), and various prevention/avoidance strategies.",
        "difficulty": Difficulty.medium,
        "question_type": QuestionType.cs_fundamentals,
        "company": "Microsoft",
        "topic": "Operating Systems",
        "tags": ["os", "concurrency", "deadlock"],
        "hints": ["4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.", "Prevention: break any one condition."],
        "solution_approach": "Define deadlock → Coffman conditions → prevention (lock ordering, timeouts) → avoidance (Banker's algorithm).",
    },
    # ── Meta ──────────────────────────────────────────────────────────────
    {
        "title": "Number of Islands",
        "description": "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
        "difficulty": Difficulty.medium,
        "question_type": QuestionType.dsa,
        "company": "Meta",
        "topic": "Graphs",
        "tags": ["dfs", "bfs", "union-find", "graphs"],
        "hints": ["DFS/BFS from each unvisited '1'.", "Mark visited cells to avoid re-counting."],
        "solution_approach": "For each '1', DFS and mark all connected cells. Count DFS calls.",
    },
    {
        "title": "Design Instagram",
        "description": "Design a photo sharing social network like Instagram. Support photo upload, follow, feed generation.",
        "difficulty": Difficulty.hard,
        "question_type": QuestionType.system_design,
        "company": "Meta",
        "topic": "System Design",
        "tags": ["cdn", "feed", "sharding", "caching"],
        "hints": ["Separate read and write paths.", "Pre-generate feeds for active users (push), pull for celebrities."],
        "solution_approach": "Object store for photos (S3+CDN), feed service with Redis cache, fan-out-on-write for small followings.",
    },
    # ── Netflix ───────────────────────────────────────────────────────────
    {
        "title": "Design Netflix Video Streaming",
        "description": "Design the backend for Netflix's video streaming service. Handle encoding, CDN distribution, and adaptive bitrate streaming.",
        "difficulty": Difficulty.hard,
        "question_type": QuestionType.system_design,
        "company": "Netflix",
        "topic": "System Design",
        "tags": ["cdn", "encoding", "streaming", "microservices"],
        "hints": ["Videos need to be encoded in multiple resolutions (HLS/DASH).", "Use CDN edge nodes close to users."],
        "solution_approach": "Upload → encoding pipeline (ffmpeg workers) → S3 → CloudFront CDN → adaptive bitrate (HLS).",
    },
]


async def seed():
    await init_db()
    existing = await Question.count()
    if existing > 0:
        print(f"⚠️  {existing} questions already exist. Skipping seed.")
        return

    for q_data in QUESTIONS:
        q = Question(**q_data)
        await q.insert()
        print(f"  ✅ {q.company}: {q.title}")

    print(f"\n🌱 Seeded {len(QUESTIONS)} questions successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
