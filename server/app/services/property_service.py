from app.extensions import db
from app.models.property import Property


def get_all_properties(search=None, property_type=None):

    query=Property.query

    if search:
        query=query.filter(Property.name.ilike(f"%{search}%"))

    if property_type:
        query=query.filter_by(type=property_type)

    return query.all()


def get_property(property_id):
    return Property.query.get(property_id)


def create_property(data):

    property=Property(
        name=data["name"],
        type=data["type"],
        total_acreage=data["total_acreage"],
        notes=data.get("notes")
    )

    db.session.add(property)
    db.session.commit()

    return property


def update_property(property, data):

    property.name=data["name"]
    property.type=data["type"]
    property.total_acreage=data["total_acreage"]
    property.notes=data.get("notes")

    db.session.commit()

    return property


def delete_property(property):

    db.session.delete(property)
    db.session.commit()