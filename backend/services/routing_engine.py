def classify_authority(road_type: str, district: str = ""):
    mapping = {
        "NH": {
            "authority": "NHAI / MoRTH regional office",
            "priority": "High",
            "escalation_channel": "NHAI grievance portal and regional project director",
        },
        "SH": {
            "authority": "State PWD Executive Engineer",
            "priority": "Medium",
            "escalation_channel": "State PWD divisional office",
        },
        "MDR": {
            "authority": "District Roads Office",
            "priority": "Medium",
            "escalation_channel": "District Collectorate roads grievance cell",
        },
        "PMGSY": {
            "authority": "State Rural Roads Development Agency",
            "priority": "High",
            "escalation_channel": "PMGSY state quality coordinator",
        },
    }

    result = mapping.get(
        road_type.upper(),
        {
            "authority": "Local municipal or district road authority",
            "priority": "Low",
            "escalation_channel": "Local civic grievance desk",
        },
    ).copy()
    result["district"] = district or "Unknown district"
    return result
