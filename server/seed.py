from app import create_app
from app.extensions import db

from app.models.user import User
from app.models.property import Property
from app.models.zone import Zone

from werkzeug.security import generate_password_hash

import random


app = create_app()


PROPERTY_TYPES = [
    "Golf Course",
    "Airport",
    "Corporate Campus",
    "University",
    "Industrial Park",
    "Other",
]

ZONE_TYPES = [
    "Fairway",
    "Rough",
    "Perimeter",
    "Exclusion",
]

STATUS = [
    "Active",
    "Inactive",
]


def rectangle(lon, lat, w=0.004, h=0.004):
    return {
        "type": "Polygon",
        "coordinates": [[
            [lon, lat],
            [lon + w, lat],
            [lon + w, lat + h],
            [lon, lat + h],
            [lon, lat],
        ]]
    }


with app.app_context():

    print("Clearing database...")

    Zone.query.delete()
    Property.query.delete()
    User.query.delete()

    db.session.commit()

    print("Creating demo user...")

    user = User(
        name="Demo User",
        email="k@gmail.com",
        password=generate_password_hash("k12345"),
    )

    db.session.add(user)
    db.session.commit()

    print("Demo user created.")


    print("Creating properties...")

    property_data = [

    ("Ahmedabad Golf Club", "Golf Course", 240, "Championship golf course", 72.580, 23.030),
    ("Vadodara Greens", "Golf Course", 185, "Public golf course", 73.180, 22.310),
    ("Surat Fairway", "Golf Course", 205, "Golf resort", 72.820, 21.180),
    ("Rajkot Golf Estate", "Golf Course", 195, "Private golf estate", 70.820, 22.300),

    ("Ahmedabad International Airport", "Airport", 780, "Commercial airport", 72.625, 23.080),
    ("Vadodara Airport", "Airport", 520, "Domestic airport", 73.225, 22.335),
    ("Surat Airport", "Airport", 640, "Regional airport", 72.740, 21.120),

    ("Infosys Ahmedabad Campus", "Corporate Campus", 110, "Software campus", 72.500, 23.050),
    ("TCS Gandhinagar", "Corporate Campus", 130, "Technology campus", 72.650, 23.210),
    ("Reliance Tech Park", "Corporate Campus", 170, "Corporate offices", 72.900, 22.980),
    ("L&T Knowledge City", "Corporate Campus", 160, "Engineering campus", 73.140, 22.280),
    ("Velocity HQ", "Corporate Campus", 95, "Operations headquarters", 72.720, 23.010),

    ("IIT Gandhinagar", "University", 320, "University campus", 72.680, 23.215),
    ("IIIT Vadodara", "University", 140, "Engineering institute", 73.181, 22.307),
    ("Nirma University", "University", 210, "Private university", 72.545, 23.129),

    ("Sanand Industrial Park", "Industrial Park", 410, "Manufacturing hub", 72.380, 22.990),
    ("Halol Industrial Estate", "Industrial Park", 430, "Industrial estate", 73.470, 22.510),
    ("Dahej SEZ", "Industrial Park", 900, "Special Economic Zone", 72.620, 21.700),

    ("Sabarmati Riverfront", "Other", 260, "Public recreational space", 72.580, 23.025),
    ("Gift City", "Other", 350, "Business district", 72.685, 23.165),

]

    properties = []

    for name, ptype, acres, notes, lon, lat in property_data:

        p = Property(
        name=name,
        type=ptype,
        total_acreage=acres,
        notes=notes,
    )

        db.session.add(p)
        db.session.flush()

        properties.append((p, lon, lat))

    db.session.commit()

    print(f"{len(properties)} properties created.")    

    print("Creating zones...")

    for property_obj, lon, lat in properties:

        for i in range(5):

            dx = (i % 2) * 0.006
            dy = (i // 2) * 0.006

            geometry = rectangle(
            lon + dx,
            lat + dy,
            w=0.005,
            h=0.005,
        )

            zone = Zone(

            property_id=property_obj.id,

            name=f"{property_obj.name} Zone {i+1}",

            zone_type=random.choice(ZONE_TYPES),

            mower_count=random.randint(1, 5),

            status=random.choice(STATUS),

            geometry=geometry,

        )

            db.session.add(zone)

    db.session.commit()

    print(
    f"{Zone.query.count()} zones created."
)

print("--------------------------------")

print("Database seeded successfully!")

print("Demo Login")

print("Email : k@gmail.com")

print("Password : k12345")