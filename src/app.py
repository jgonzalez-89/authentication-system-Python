import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_bcrypt import generate_password_hash, check_password_hash, Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from datetime import timedelta



#from models import Person

ENV = os.getenv("FLASK_ENV")
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type = True)
db.init_app(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

app.config["JWT_SECRET_KEY"] = "super_password" # ¡Cambia las palabras "super-secret" por otra cosa!
jwt = JWTManager(app)



# generate sitemap with all your endpoints

@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"message": "Missing email or password", "status": 400})

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "Email already registered", "status": 400})

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Generar el token de acceso sin expiración
    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "Registered successfully",
        "access_token": access_token
    })

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"message": "Missing email or password", "status": 400})

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "User not found", "status": 404})

    if not bcrypt.check_password_hash(user.hash, password):
        return jsonify({"message": "Invalid email or password", "status": 401})

    # Generar el token de acceso sin expiración
    access_token = create_access_token(identity=user.id)

    print("Token de acceso generado:", access_token)

    return jsonify({
        "message": "Logged in successfully",
        "access_token": access_token
    })

@app.route('/private', methods=['GET'])
@jwt_required()
def handle_private():
    response_body = {
        "message": "This is a private route",
        "ok": True,
        "user": get_jwt_identity()
    }

    return jsonify(response_body), 200



@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0 # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)