from datetime import datetime

from app.extensions import db


class Property(db.Model):

    __tablename__ = "properties"

    id=db.Column(db.Integer, primary_key=True)

    name=db.Column(db.String(120), nullable=False)

    type=db.Column(db.String(50), nullable=False)

    total_acreage=db.Column(db.Float, nullable=False)

    notes=db.Column(db.Text)

    created_at=db.Column(
        db.DateTime,
        default=datetime.now,
    )

    zones=db.relationship(
        "Zone",
        backref="property",
        cascade="all, delete-orphan",
        lazy=True,
    )