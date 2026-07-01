from app import create_app
from app.extensions import db

from app.models.user import User
from app.models.property import Property
from app.models.zone import Zone

from werkzeug.security import generate_password_hash

import random


app=create_app()

random.seed(42)

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


import math


def random_polygon(center_lon, center_lat, avg_radius=0.0025, num_points=None,
                    irregularity=0.6, spikiness=0.5):
    

    if num_points is None:
        num_points=random.randint(5, 9)

    irregularity=max(0.0, min(1.0, irregularity))
    spikiness=max(0.0, min(1.0, spikiness))

    #uneven angular steps that still sum to 2*pi
    angle_steps = []
    lower = (2 * math.pi / num_points) * (1 - irregularity)
    upper = (2 * math.pi / num_points) * (1 + irregularity)
    total = 0
    for _ in range(num_points):
        step = random.uniform(lower, upper)
        angle_steps.append(step)
        total += step
    angle_steps = [s * (2 * math.pi / total) for s in angle_steps]

    points = []
    angle = random.uniform(0, 2*math.pi)

    for step in angle_steps:
        radius = max(avg_radius * 0.35, random.gauss(avg_radius, avg_radius * spikiness * 0.5))
        x = center_lon + radius * math.cos(angle)
        y = center_lat + radius * math.sin(angle)*0.85  
        points.append([round(x, 6), round(y, 6)])
        angle += step

    points.append(points[0])  

    return {
        "type": "Polygon",
        "coordinates": [points],
    }


CITIES = [
    ("Mumbai", 72.8777, 19.0760),
    ("Delhi", 77.1025, 28.7041),
    ("Bangalore", 77.5946, 12.9716),
    ("Hyderabad", 78.4867, 17.3850),
    ("Chennai", 80.2707, 13.0827),
    ("Kolkata", 88.3639, 22.5726),
    ("Pune", 73.8567, 18.5204),
    ("Ahmedabad", 72.5714, 23.0225),
    ("Jaipur", 75.7873, 26.9124),
    ("Surat", 72.8311, 21.1702),
    ("Lucknow", 80.9462, 26.8467),
    ("Kanpur", 80.3319, 26.4499),
    ("Nagpur", 79.0882, 21.1458),
    ("Indore", 75.8577, 22.7196),
    ("Thane", 72.9781, 19.2183),
    ("Bhopal", 77.4126, 23.2599),
    ("Visakhapatnam", 83.2185, 17.6868),
    ("Pimpri-Chinchwad", 73.8000, 18.6298),
    ("Patna", 85.1376, 25.5941),
    ("Vadodara", 73.1812, 22.3072),
    ("Ghaziabad", 77.4538, 28.6692),
    ("Ludhiana", 75.8573, 30.9010),
    ("Agra", 78.0081, 27.1767),
    ("Nashik", 73.7898, 19.9975),
    ("Faridabad", 77.3178, 28.4089),
    ("Meerut", 77.7064, 28.9845),
    ("Rajkot", 70.8022, 22.3039),
    ("Kalyan-Dombivli", 73.1300, 19.2403),
    ("Vasai-Virar", 72.8200, 19.3900),
    ("Varanasi", 82.9739, 25.3176),
    ("Srinagar", 74.7973, 34.0837),
    ("Aurangabad", 75.3433, 19.8762),
    ("Dhanbad", 86.4304, 23.7957),
    ("Amritsar", 74.8723, 31.6340),
    ("Navi Mumbai", 73.0297, 19.0330),
    ("Prayagraj", 81.8463, 25.4358),
    ("Ranchi", 85.3096, 23.3441),
    ("Howrah", 88.2636, 22.5958),
    ("Coimbatore", 76.9558, 11.0168),
    ("Jabalpur", 79.9864, 23.1815),
    ("Gwalior", 78.1828, 26.2183),
    ("Vijayawada", 80.6480, 16.5062),
    ("Jodhpur", 73.0243, 26.2389),
    ("Madurai", 78.1198, 9.9252),
    ("Raipur", 81.6296, 21.2514),
    ("Kota", 75.8648, 25.2138),
    ("Chandigarh", 76.7794, 30.7333),
    ("Guwahati", 91.7362, 26.1445),
    ("Solapur", 75.9064, 17.6599),
    ("Mysore", 76.6394, 12.2958),
]


GOLF_NAMES = [
    "{city} Golf Club", "{city} Greens", "{city} Fairway Resort",
    "{city} Golf & Country Club", "{city} Championship Links",
]
AIRPORT_NAMES = [
    "{city} International Airport", "{city} Domestic Airport",
    "{city} Regional Airport", "{city} Airbase",
]
CORPORATE_BRANDS = [
    "Infosys", "TCS", "Wipro", "HCL Tech", "Tech Mahindra", "Accenture",
    "Cognizant", "Reliance", "Adani", "L&T", "Capgemini", "IBM",
    "Larsen & Toubro", "Mahindra", "Godrej", "ITC", "Velocity Labs",
    "Zoho", "Flipkart", "Tata Consultancy",
]
CORPORATE_SUFFIX = ["Campus", "Tech Park", "Knowledge Park", "IT Hub", "Office Park", "Innovation Center"]
UNIVERSITY_NAMES = [
    "IIT {city}", "IIM {city}", "NIT {city}", "{city} University",
    "{city} Institute of Technology", "Central University of {city}",
]
INDUSTRIAL_NAMES = [
    "{city} Industrial Park", "{city} SEZ", "{city} Manufacturing Hub",
    "{city} Industrial Estate", "{city} Logistics Park",
]
OTHER_NAMES = [
    "{city} Riverfront", "{city} Business District", "{city} Sports Complex",
    "{city} Central Park", "{city} Convention Center", "{city} Stadium Grounds",
]

TYPE_CONFIG = {
    "Golf Course": {
        "names": GOLF_NAMES,
        "acreage": (150, 260),
        "notes": ["Championship golf course", "Public golf course", "Golf resort", "Private golf estate"],
    },
    "Airport": {
        "names": AIRPORT_NAMES,
        "acreage": (450, 950),
        "notes": ["Commercial airport", "Domestic airport", "Regional airport", "Cargo & passenger airport"],
    },
    "Corporate Campus": {
        "names": None,  # built from CORPORATE_BRANDS
        "acreage": (80, 200),
        "notes": ["Software campus", "Technology campus", "Corporate offices", "Operations headquarters"],
    },
    "University": {
        "names": UNIVERSITY_NAMES,
        "acreage": (120, 350),
        "notes": ["University campus", "Engineering institute", "Private university", "Research campus"],
    },
    "Industrial Park": {
        "names": INDUSTRIAL_NAMES,
        "acreage": (350, 950),
        "notes": ["Manufacturing hub", "Industrial estate", "Special Economic Zone", "Logistics park"],
    },
    "Other": {
        "names": OTHER_NAMES,
        "acreage": (60, 350),
        "notes": ["Public recreational space", "Business district", "Sports & events venue", "Mixed-use development"],
    },
}


def build_property_data():

    data=[]
    used_names=set()

#each city with 4-5 distinct properties
    for city, base_lon, base_lat in CITIES:

        types_for_city=random.sample(PROPERTY_TYPES, k=random.choice([4, 5]))

        for ptype in types_for_city:

            cfg=TYPE_CONFIG[ptype]

            if ptype == "Corporate Campus":
                brand=random.choice(CORPORATE_BRANDS)
                suffix=random.choice(CORPORATE_SUFFIX)
                name=f"{brand} {city} {suffix}"
            else:
                template=random.choice(cfg["names"])
                name=template.format(city=city)

           
            attempt=0
            while name in used_names and attempt < 5:
                if ptype == "Corporate Campus":
                    brand=random.choice(CORPORATE_BRANDS)
                    suffix=random.choice(CORPORATE_SUFFIX)
                    name=f"{brand} {city} {suffix}"
                else:
                    template=random.choice(cfg["names"])
                    name=template.format(city=city)
                attempt+=1
            used_names.add(name)

            acres=random.randint(*cfg["acreage"])
            notes=random.choice(cfg["notes"])

            #scattered each property a little around the city center
            lon=base_lon+random.uniform(-0.08, 0.08)
            lat=base_lat+random.uniform(-0.08, 0.08)

            data.append((name, ptype, acres, notes, lon, lat))

    return data


property_data=build_property_data()


with app.app_context():

    print("Clearing database...")

    Zone.query.delete()
    Property.query.delete()
    User.query.delete()

    db.session.commit()

    print("Creating demo user...")

    user=User(
        name="Demo User",
        email="k@gmail.com",
        password=generate_password_hash("k12345"),
    )

    db.session.add(user)
    db.session.commit()

    print("Demo user created.")

    print("Creating properties...")

    properties=[]

    for name, ptype, acres, notes, lon, lat in property_data:

        p=Property(
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

    zone_count=0

    for property_obj, lon, lat in properties:

        num_zones=random.randint(5, 10)

        for i in range(num_zones):

            
            #irregular polygons ofc
            zone_lon=lon+random.uniform(-0.01, 0.01)
            zone_lat=lat+random.uniform(-0.01, 0.01)

            geometry=random_polygon(
                zone_lon,
                zone_lat,
                avg_radius=random.uniform(0.0015, 0.0035),
            )

            zone=Zone(
                property_id=property_obj.id,
                name=f"{property_obj.name} Zone {i + 1}",
                zone_type=random.choice(ZONE_TYPES),
                mower_count=random.randint(1, 5),
                status=random.choice(STATUS),
                geometry=geometry,
            )

            db.session.add(zone)
            zone_count += 1

    db.session.commit()

    print(f"{zone_count} zones created.")

print("--------------------------------")
print(f"{len(property_data)} properties seeded.")
print("Database seeded successfully!")
print("Demo Login")
print("Email : k@gmail.com")
print("Password : k12345")