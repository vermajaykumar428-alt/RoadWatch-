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
            {"road": "NH-44", "type": "NH", "district": "Chennai", "status": "Moderate", "lat": 13.0827, "lng": 80.2707},
            {"road": "SH-17", "type": "SH", "district": "Kanchipuram", "status": "Needs Review", "lat": 12.9716, "lng": 79.1599},
            {"road": "MDR-4", "type": "MDR", "district": "Thiruvallur", "status": "High Risk", "lat": 13.6288, "lng": 79.4192},
        ]
