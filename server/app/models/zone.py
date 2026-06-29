from datetime import datetime

from app.extensions import db


class Zone(db.Model):

    __tablename__ = "zones"

    id=db.Column(db.Integer, primary_key=True)

    property_id=db.Column(
        db.Integer,
        db.ForeignKey("properties.id"),
        nullable=False,
    )

    name=db.Column(db.String(120), nullable=False)

    zone_type=db.Column(db.String(50), nullable=False)

    mower_count=db.Column(db.Integer, nullable=False)

    status=db.Column(
        db.String(20),
        default="Active",
    )

    geometry=db.Column(
        db.JSON,
        nullable=False,
    )

    created_at=db.Column(
        db.DateTime,
        default=datetime.now,
    )