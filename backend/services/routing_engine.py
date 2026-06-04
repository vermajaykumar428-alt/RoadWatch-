def classify_authority(road_type: str, district: str = ""):
    mapping = {
        "NH": {"authority": "NHAI / MoRTH", "priority": "High"},
        "SH": {"authority": "State PWD Executive Engineer", "priority": "Medium"},
        "MDR": {"authority": "District Roads Office", "priority": "Medium"},
        "PMGSY": {"authority": "State Rural Roads Development Agency", "priority": "High"},
    }

    result = mapping.get(road_type.upper(), {"authority": "Local Municipal Authority", "priority": "Low"})
    result["district"] = district or "Unknown district"
    return result
