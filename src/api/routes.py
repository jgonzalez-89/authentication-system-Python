from flask import Flask, request, jsonify, url_for, Blueprint, json
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)



@api.route("/register", methods=["POST"])
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

    # Generar el token de acceso
    access_token = create_access_token(
        identity=new_user.id, expires_delta=timedelta(minutes=30))

    return jsonify({
        "message": "Registered successfully",
        "access_token": access_token
    })


@api.route("/login", methods=["POST"])
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

    # Generar el token de acceso
    access_token = create_access_token(
        identity=user.id, expires_delta=timedelta(minutes=30))

    return jsonify({
        "message": "Logged in successfully",
        "access_token": access_token
    })




##############################################################



# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

# @api.route('/signup', methods=['POST'])
# def handle_user():
#     data = request.data
#     data = json.loads(data)

#     user = User(email = data['email'], password = data['password'], is_active=True)
#     db.session.add(user)
#     db.session.commit()

#     response_body = {
#         "email": data['email'],
#         "password": data['password'],
#         "ok": "true"
#     }

#     return jsonify(response_body), 200


# @api.route('/login', methods=['POST'])
# def login():
#     email = request.json.get("email", None)
#     password = request.json.get("password", None)
#     user = User.query.filter_by(email=email, password=password).first()

#     if user == None:
#         return jsonify({"msg": "Bad username or password"}), 401
    
#     access_token = create_access_token(identity=user.email)
#     response_body = {
#         "message": "Token created",
#         "token": access_token
#     }
    
#     return jsonify(response_body), 200

# @api.route('/private', methods=['GET'])
# @jwt_required()
# def handle_private():
    
#     response_body = {
#         "message": "This is a private route",
#         "ok": "true",
#         "user": get_jwt_identity()
#     }

#     return jsonify(response_body), 200

