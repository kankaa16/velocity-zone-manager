from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from app.services.property_service import *

from app.utils.response import success, error

property_bp=Blueprint("property", __name__)

@property_bp.get("")
@jwt_required()
def properties():

    search=request.args.get("search")

    property_type=request.args.get("type")

    properties=get_all_properties(
        search,
        property_type
    )

    data=[]

    for p in properties:

        data.append({
            "id": p.id,
            "name": p.name,
            "type": p.type,
            "total_acreage": p.total_acreage,
            "notes": p.notes
        })

    return success(data=data)

@property_bp.post("")
@jwt_required()
def create():

    body=request.get_json()

    required=[
        "name",
        "type",
        "total_acreage"
    ]

    if not all(body.get(field) for field in required):
        return error("Missing required fields.")

    property=create_property(body)

    return success(
        "Property created.",
        {
            "id": property.id
        },
        201
    )

@property_bp.get("/<int:property_id>")
@jwt_required()
def get(property_id):

    property=get_property(property_id)

    if not property:
        return error("Property not found.",404)

    return success(data={
        "id":property.id,
        "name":property.name,
        "type":property.type,
        "total_acreage":property.total_acreage,
        "notes":property.notes
    })

@property_bp.delete("/<int:property_id>")
@jwt_required()
def delete(property_id):

    property=get_property(property_id)

    if not property:
        return error("Property not found.",404)

    delete_property(property)

    return success("Property deleted.")


@property_bp.put("/<int:property_id>")
@jwt_required()
def update(property_id):

    property=get_property(property_id)

    if not property:
        return error("Property not found.",404)

    body=request.get_json()

    update_property(property,body)

    return success("Property updated.")