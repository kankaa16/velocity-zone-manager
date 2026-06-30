from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from app.models.property import Property
from app.services.zone_service import (
    import_geojson,
    export_geojson,
    property_summary
)
from app.services.zone_service import *

from app.utils.geojson_validator import validate_geojson

from app.utils.response import success, error

zone_bp=Blueprint("zone", __name__)


@zone_bp.get("/properties/<int:property_id>/zones")
@jwt_required()


def property_zones(property_id):

    property=db.session.get(Property, property_id)

    if not property:
        return error("Property not found.",404)

    zones=get_property_zones(property_id)

    

    data=[]

    print(">>> PROPERTY_ZONES CALLED")


    for zone in zones:
        acres = calculate_acreage(zone.geometry)

        recommended = recommended_mowers(zone.geometry)


        print("ZONE:", zone.id)
        print("ACRES:", acres)


        data.append({

            "id":zone.id,

            "name":zone.name,

            "zone_type":zone.zone_type,

            "mower_count":zone.mower_count,

            "status":zone.status,

            "geometry":zone.geometry,
             "acreage": calculate_acreage(zone.geometry),

             "recommended_mowers": recommended,

            "understaffed": is_understaffed(zone),
    
        })

    return success(data=data)


@zone_bp.post("/properties/<int:property_id>/zones")
@jwt_required()
def create(property_id):

    property=db.session.get(Property, property_id)

    if not property:
        return error("Property not found.",404)

    body=request.get_json()

    required=[
        "name",
        "zone_type",
        "mower_count",
        "geometry"
    ]

    if not all(body.get(x) is not None for x in required):
        return error("Missing required fields.")

    zone=create_zone(property_id,body)

    return success(
        "Zone created.",
        {
            "id":zone.id
        },
        201
    )

@zone_bp.get("/zones/<int:zone_id>")
@jwt_required()
def get(zone_id):

    zone=get_zone(zone_id)

    if not zone:
        return error("Zone not found.",404)

    return success(data={

        "id":zone.id,

        "name":zone.name,

        "zone_type":zone.zone_type,

        "mower_count":zone.mower_count,

        "status":zone.status,

        "geometry":zone.geometry,

         "acreage": calculate_acreage(zone.geometry),
         "recommended_mowers": 
         
         recommended_mowers(zone.geometry),

        "understaffed": is_understaffed(zone),

    })


@zone_bp.put("/zones/<int:zone_id>")
@jwt_required()
def update(zone_id):

    zone=get_zone(zone_id)

    if not zone:
        return error("Zone not found.",404)

    body=request.get_json()

    update_zone(zone,body)

    return success("Zone updated.")


@zone_bp.delete("/zones/<int:zone_id>")
@jwt_required()
def delete(zone_id):

    zone=get_zone(zone_id)

    if not zone:
        return error("Zone not found.",404)

    delete_zone(zone)

    return success("Zone deleted.")

#geojson endpts 

@zone_bp.post("/properties/<int:property_id>/zones/import")
@jwt_required()
def import_zones(property_id):

    property = db.session.get(Property, property_id)

    if not property:
        return error("Property not found.", 404)

    body = request.get_json()

    validation_error = validate_geojson(body)

    if validation_error:
        return error(validation_error, 400)

    count = import_geojson(property_id, body)

    return success(f"{count} zones imported.")

@zone_bp.get("/properties/<int:property_id>/zones/export")
@jwt_required()
def export(property_id):

    property=db.session.get(Property, property_id)

    if not property:
        return error("Property not found.", 404)

    return success(
        data=export_geojson(property_id)
    )

@zone_bp.get("/properties/<int:property_id>/summary")
def summary(property_id):

    property=db.session.get(Property, property_id)

    if not property:
        return error("Property not found.",404)

    return success(
        data=property_summary(property_id)
    )