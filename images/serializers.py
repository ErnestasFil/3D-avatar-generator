import base64
import os
import uuid

from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework import serializers, status

from Backend.validation import Exception, Validation

from .models import Photo


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith("data:image"):
            format_str, imgstr = data.split(";base64,")
            ext = format_str.split("/")[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            data = ContentFile(base64.b64decode(imgstr), name=filename)
            print(filename)
        return super().to_internal_value(data)


class PhotoSerializer(serializers.ModelSerializer):
    upload_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Photo
        fields = ("id", "name", "path", "upload_date")


class ImagePostSerializer(serializers.ModelSerializer):
    image = Base64ImageField(write_only=True, required=False)

    class Meta:
        model = Photo
        fields = ["name", "image"]
        extra_kwargs = {"image": {"write_only": True}}

    def validate(self, attrs):
        errors = {}

        name = attrs.get("name")
        image = attrs.get("image")

        name_validator = Validation("name", name)
        name_validator.validate_required()
        name_validator.validate_alphanumeric_spaces()
        name_validator.validate_min_length(10)
        name_validator.validate_max_length(100)
        errors.update(name_validator.get_errors())

        image_validator = Validation("image", image)
        image_validator.validate_required()
        image_validator.validate_image_format(image.name if image else "")
        image_validator.validate_image_size(image, 500, 500, 3000, 3000)

        errors.update(image_validator.get_errors())

        if errors:
            raise Exception(errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        user_id = self.context["request"].user.id
        image_data = validated_data.get("image")
        filename = os.path.basename(image_data.name)
        upload_folder = os.path.join(settings.MEDIA_ROOT, "")
        os.makedirs(upload_folder, exist_ok=True)
        image_path = os.path.join(upload_folder, filename)
        with open(image_path, "wb") as image_file:
            image_data.seek(0)
            image_file.write(image_data.read())
        image = Photo(
            name=name, path=settings.MEDIA_ROOT + "/" + filename, fk_userid_id=user_id
        )
        image.save()
        return image
