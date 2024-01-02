from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User as auth
from rest_framework import serializers, status

from Backend.validation import Exception, Validation

from .models import User


class UserSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = User
        fields = ("name", "surname", "email", "created_at")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(
        style={"input_type": "password"},
        write_only=True,
        required=False,
        validators=[],
    )

    class Meta:
        model = User
        fields = ["email", "name", "surname", "password", "password_confirmation"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        errors = {}

        name = attrs.get("name")
        surname = attrs.get("surname")
        email = attrs.get("email")
        password = attrs.get("password")
        password_confirmation = attrs.get("password_confirmation")

        name_validator = Validation("name", name)
        name_validator.validate_required()
        name_validator.validate_alpha()
        name_validator.validate_min_length(3)
        name_validator.validate_max_length(25)
        errors.update(name_validator.get_errors())

        surname_validator = Validation("surname", surname)
        surname_validator.validate_required()
        surname_validator.validate_alpha()
        surname_validator.validate_min_length(5)
        surname_validator.validate_max_length(40)
        errors.update(surname_validator.get_errors())

        password_validator = Validation("password", password)
        password_validator.validate_required()
        password_validator.validate_password_strength()
        password_validator.validate_value_equal(
            password_confirmation, "password confirmation"
        )
        errors.update(password_validator.get_errors())

        password_validator_confirm = Validation(
            "password_confirmation", password_confirmation, "password confirmation"
        )
        password_validator_confirm.validate_required()
        errors.update(password_validator_confirm.get_errors())

        email_validator = Validation("email", email)
        email_validator.validate_required()
        email_validator.validate_email()
        email_validator.validate_unique_field(User, "email")
        errors.update(email_validator.get_errors())

        if errors:
            raise Exception(errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        return attrs

    def create(self, validated_data):
        email = validated_data.get("email")
        name = validated_data.get("name")
        surname = validated_data.get("surname")
        password = validated_data.get("password")
        hashed_password = make_password(password)
        user = User(email=email, name=name, surname=surname, password=hashed_password)
        auth.objects.create_user(
            username=email, email=email, password=hashed_password
        ).save()
        user.save()
        return user


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]

    def validate(self, attrs):
        errors = {}
        email = attrs.get("email")
        password = attrs.get("password")

        password_validator = Validation("password", password)
        password_validator.validate_required()
        errors.update(password_validator.get_errors())

        email_validator = Validation("email", email)
        email_validator.validate_required()
        email_validator.validate_email()
        errors.update(email_validator.get_errors())

        if errors:
            raise Exception(errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        return attrs


class EmailAuthBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None):
        try:
            print("eikit nx kurva")
            user = User.objects.get(email=email)
            if user.check_password(password):
                return user
            return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
