from flask import Flask

from app.config import Config
from app.extensions import db, jwt, cors, swagger


def create_app():

    app=Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    swagger.init_app(app)

    from app.models import User, Property, Zone
    from app.routes.health import health_bp
    from app.routes.auth import auth_bp
    from app.routes.property import property_bp
    from app.routes.zone import zone_bp

#for server checks
    app.register_blueprint(health_bp)
#auth route    
    app.register_blueprint(
    auth_bp,
    url_prefix="/auth"
    )
#property route
    app.register_blueprint(
    property_bp,
    url_prefix="/properties"
)
#zone route    
    app.register_blueprint(zone_bp)
    
    with app.app_context():
        db.create_all()

    return app