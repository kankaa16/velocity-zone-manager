from app.extensions import db
from app.models.zone import Zone
from shapely.geometry import shape
import math


def get_property_zones(property_id):
    return Zone.query.filter_by(property_id=property_id).all()


def get_zone(zone_id):
    return db.session.get(Zone, zone_id)


def create_zone(property_id, data):

    zone = Zone(
        property_id=property_id,
        name=data["name"],
        zone_type=data["zone_type"],
        mower_count=data["mower_count"],
        geometry=data["geometry"],
        status=data.get("status", "Active")
    )

    db.session.add(zone)
    db.session.commit()

    return zone


def update_zone(zone, data):

    zone.name=data["name"]
    zone.zone_type=data["zone_type"]
    zone.mower_count=data["mower_count"]
    zone.geometry=data["geometry"]
    zone.status=data["status"]

    db.session.commit()

    return zone


def delete_zone(zone):

    db.session.delete(zone)
    db.session.commit()


#geojson fns


def import_geojson(property_id, geojson):

    features=geojson.get("features", [])

    imported=0

    for feature in features:

        props=feature.get("properties", {})

        geometry=feature.get("geometry")

        zone=Zone(
            property_id=property_id,
            name=props.get("name", f"Zone {imported+1}"),
            zone_type=props.get("zone_type", "Normal"),
            mower_count=props.get("mower_count", 0),
            status=props.get("status", "Active"),
            geometry=geometry,
        )

        db.session.add(zone)

        imported+=1

    db.session.commit()

    return imported


def export_geojson(property_id):

    zones=Zone.query.filter_by(property_id=property_id).all()

    features=[]

    for zone in zones:

        features.append({

            "type": "Feature",

            "properties": {
                "id": zone.id,
                "name": zone.name,
                "zone_type": zone.zone_type,
                "mower_count": zone.mower_count,
                "status": zone.status
            },

            "geometry": zone.geometry

        })

    return {
        "type": "FeatureCollection",
        "features": features
    }


def property_summary(property_id):

    zones = Zone.query.filter_by(property_id=property_id).all()

    total_zones = len(zones)

    total_acreage = sum(
    calculate_acreage(z.geometry)
    for z in zones
)

    total_mowers = sum(z.mower_count for z in zones)

    active_zones = sum(z.status == "Active" for z in zones)

    inactive_zones = total_zones - active_zones

    understaffed_zones = sum(z.mower_count < 2 for z in zones)

    coverage = 0

    if total_zones > 0:

        coverage = round((active_zones / total_zones) * 100)

    return {

    "total_zones": total_zones,

    "total_acreage": round(total_acreage, 2),

    "total_mowers": total_mowers,

    "recommended_mowers": sum(
        recommended_mowers(z.geometry)
        for z in zones
    ),

    "active_zones": active_zones,

    "inactive_zones": inactive_zones,

    "understaffed_zones": sum(
        is_understaffed(z)
        for z in zones
    ),

    "coverage": coverage,

}
from shapely.geometry import shape

def calculate_acreage(geometry):

    if not geometry:
        return 0

    if geometry.get("type") is None:
        return 0

    try:
        polygon = shape(geometry)

        area_m2 = polygon.area * 111320 * 111320

        return round(area_m2 / 4046.85642, 2)

    except Exception as e:
        print("Invalid geometry:", geometry)
        print(e)
        return 0
    
def is_understaffed(zone):

    acreage = calculate_acreage(zone.geometry)

    required = max(1, round(acreage / 25))

    return zone.mower_count < required    


def recommended_mowers(geometry):

    acreage = calculate_acreage(geometry)

    return max(1, math.ceil(acreage / 25))