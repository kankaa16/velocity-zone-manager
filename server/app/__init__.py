from flask import Flask
from flask import jsonify
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

#global err handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
        "success": False,
        "message": "Endpoint not found."
        }), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
        "success": False,
        "message": "Bad request."
    }), 400

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
        "success": False,
        "message": "Internal server error."
    }), 500

#jwt global err handlers
    @jwt.unauthorized_loader
    def unauthorized(reason):
        return jsonify({
        "success": False,
        "message": "Authorization token missing."
    }), 401


    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({
        "success": False,
        "message": "Invalid token."
    }), 401


    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify({
        "success": False,
        "message": "Token expired."
    }), 401    

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