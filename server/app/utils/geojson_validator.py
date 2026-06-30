def validate_geojson(data):
    if not isinstance(data, dict):
        return "Invalid JSON payload."

    if data.get("type") != "FeatureCollection":
        return "GeoJSON must be a FeatureCollection."

    features = data.get("features")

    if features is None:
        return "FeatureCollection must contain a 'features' array."

    if not isinstance(features, list):
        return "'features' must be an array."

    if len(features) == 0:
        return "FeatureCollection contains no features."

    for i, feature in enumerate(features):

        if feature.get("type") != "Feature":
            return f"Feature {i + 1} is not a valid Feature."

        geometry = feature.get("geometry")

        if geometry is None:
            return f"Feature {i + 1} has no geometry."

        geometry_type = geometry.get("type")

        if geometry_type not in ("Polygon", "MultiPolygon"):
            return (
                f"Feature {i + 1} contains unsupported geometry "
                f"'{geometry_type}'. Only Polygon and MultiPolygon are allowed."
            )

        if "coordinates" not in geometry:
            return f"Feature {i + 1} has no coordinates."

    return None