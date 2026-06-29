def validate_property(data):
    if not data:
        return False, "Request body is required."

    if not data.get("name"):
        return False, "Name is required."

    if not data.get("type"):
        return False, "Type is required."

    if data.get("total_acreage", 0) <= 0:
        return False, "Acreage must be greater than 0."

    return True, None


def validate_zone(data):
    if not data:
        return False, "Request body is required."

    required = [
        "name",
        "zone_type",
        "mower_count",
        "geometry"
    ]

    for field in required:
        if field not in data:
            return False, f"{field} is required."

    if data["mower_count"] < 0:
        return False, "Mower count cannot be negative."

    geometry = data["geometry"]

    if geometry.get("type") != "Polygon":
        return False, "Only Polygon geometry is supported."

    if "coordinates" not in geometry:
        return False, "Geometry coordinates missing."

    return True, None