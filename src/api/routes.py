from flask import Flask, request, jsonify, url_for, Blueprint, json
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask import Blueprint, jsonify, request
from api.models import db, User
from flask_bcrypt import Bcrypt


api = Blueprint('api', __name__)

