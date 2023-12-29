import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from django.utils.translation import gettext as _
from PIL import Image
from rest_framework.exceptions import APIException


class Exception(APIException):
    def __init__(self, detail, status_code):
        self.detail = detail
        if status_code is not None:
            self.status_code = status_code


class Validation:
    def __init__(self, field_name, value, extra_name=""):
        self.field_name = field_name
        self.value = value
        self.extra_name = extra_name if extra_name else field_name
        self.errors = {}

    def add_error(self, message):
        if self.field_name not in self.errors:
            self.errors[self.field_name] = []
            self.errors[self.field_name].append(message)

    def validate_required(self):
        if not self.value:
            self.add_error(f"Field {self.extra_name} may not be blank.")

    def validate_alpha(self):
        if self.value is not None and not self.value.isalpha():
            self.add_error("This field can only contain letters.")

    def validate_alphanumeric_spaces(self):
        if self.value is not None and not re.match("^[a-zA-Z0-9\s]*$", self.value):
            self.add_error("This field can only contain letters, numbers, and spaces.")

    def validate_unique_field(self, model, field):
        if (
            self.value is not None
            and model.objects.filter(**{field: self.value}).exists()
        ):
            self.add_error(f"Object with this {field} already exists.")

    def validate_password_strength(self):
        if self.value is None:
            return
        try:
            validate_password(self.value)
        except ValidationError as e:
            self.add_error(e.messages[0])
            return
        if len(self.value) < 8:
            self.add_error("Password must be at least 8 characters long.")

        if not any(char.isupper() for char in self.value):
            self.add_error("Password must contain at least one uppercase letter.")

        if not any(char.isdigit() for char in self.value):
            self.add_error("Password must contain at least one digit.")

        if not any(char in "!@#$%^&*()-_=+[]{}|;:'\",.<>/?`~" for char in self.value):
            self.add_error("Password must contain at least one special character.")

    def validate_min_length(self, min_length):
        if self.value is not None and len(self.value) < min_length:
            self.add_error(
                f"Field {self.field_name} must be at least {min_length} characters long."
            )

    def validate_max_length(self, max_length):
        if self.value is not None and len(self.value) > max_length:
            self.add_error(
                f"Field {self.field_name} must be less than {max_length} characters long."
            )

    def validate_value_equal(self, value, field):
        if self.value is not None and not self.value == value:
            self.add_error(f"Fields {self.field_name} and {field} don't match.")

    def validate_object_exists(self, obj, field):
        try:
            if not obj.objects.filter(**{field: self.value}).exists():
                self.add_error(f"Object {self.field_name} doesn't exist")
        except:
            self.add_error(f"Object {self.field_name} error")

    def validate_user_owns_object(self, obj, user_id, field):
        photo = obj.objects.filter(**{field: self.value}, fk_userid=user_id).first()
        if not photo:
            self.add_error(f"User does not own the {self.field_name}.")

    def validate_email(self):
        if self.value is None:
            return
        try:
            EmailValidator()(self.value)
        except ValidationError as e:
            self.add_error(e.messages[0])

    def validate_image_format(self, file_name):
        allowed_formats = ["png", "jpg", "jpeg"]
        ext = file_name.split(".")[-1].lower()
        if self.value is not None and ext not in allowed_formats:
            self.add_error(
                f"Invalid image format for {self.field_name}. Allowed formats are {', '.join(allowed_formats)}"
            )

    def validate_image_size(self, image, minw, minh, maxw, maxh):
        if image is not None:
            width, height = Image.open(image).size
            if width < minw or height < minh:
                self.add_error(
                    f"Image dimensions for {self.field_name} must be at least {minw}x{minh}."
                )
            elif width > maxw or height > maxh:
                self.add_error(
                    f"Image dimensions for {self.field_name} must not exceed {maxw}x{maxh}."
                )

    def get_errors(self):
        return self.errors
