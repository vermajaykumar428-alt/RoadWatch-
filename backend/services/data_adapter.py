import json
import os
from pathlib import Path


class RoadDataAdapter:
    def __init__(self, source_path: str | None = None):
        self.source_path = Path(source_path or os.getenv("ROADWATCH_DATA_FILE", "data/road_samples.json"))

    def load_roads(self):
        if not self.source_path.exists():
            return self._default_roads()

        try:
            return json.loads(self.source_path.read_text(encoding="utf-8"))
        except Exception:
            return self._default_roads()

    def _default_roads(self):
        return [
            {
                "road": "NH-44",
                "type": "NH",
                "district": "Chennai",
                "status": "Needs inspection",
                "risk": "High",
                "lat": 13.0827,
                "lng": 80.2707,
                "contractor": "South Corridor Maintenance JV",
                "budget_sanctioned": "Rs 18.4 crore",
                "budget_spent": "Rs 12.9 crore",
                "last_repair": "2025-11-18",
                "next_review": "2026-06-20",
                "source_url": "https://morth.nic.in/",
                "issue_summary": "Recurring pothole cluster near high-traffic interchange.",
            },
            {
                "road": "SH-17",
                "type": "SH",
                "district": "Kanchipuram",
                "status": "Moderate wear",
                "risk": "Medium",
                "lat": 12.9716,
                "lng": 79.1599,
                "contractor": "Tamil Nadu PWD Zone-II",
                "budget_sanctioned": "Rs 8.7 crore",
                "budget_spent": "Rs 6.1 crore",
                "last_repair": "2026-01-09",
                "next_review": "2026-07-01",
                "source_url": "https://data.gov.in/",
                "issue_summary": "Shoulder damage and drainage overflow reported after monsoon.",
            },
            {
                "road": "MDR-4",
                "type": "MDR",
                "district": "Thiruvallur",
                "status": "High risk",
                "risk": "High",
                "lat": 13.6288,
                "lng": 79.4192,
                "contractor": "District Rural Roads Cell",
                "budget_sanctioned": "Rs 3.2 crore",
                "budget_spent": "Rs 2.4 crore",
                "last_repair": "2025-09-27",
                "next_review": "2026-06-12",
                "source_url": "https://pmgsy.nic.in/",
                "issue_summary": "Surface cracking and poor night visibility near school zone.",
            },
            {
                "road": "PMGSY-TN-108",
                "type": "PMGSY",
                "district": "Villupuram",
                "status": "Repair pending",
                "risk": "Medium",
                "lat": 11.9401,
                "lng": 79.4861,
                "contractor": "SRRDA Package TN-108",
                "budget_sanctioned": "Rs 2.6 crore",
                "budget_spent": "Rs 1.8 crore",
                "last_repair": "2025-08-15",
                "next_review": "2026-06-25",
                "source_url": "https://pmgsy.nic.in/",
                "issue_summary": "Village access road has broken edges and water stagnation points.",
            },
        ]
