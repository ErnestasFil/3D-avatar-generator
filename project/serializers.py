import base64
import os
import uuid

from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework import serializers, status

from Backend.validation import Exception, Validation
from images.models import Photo

from .models import Project


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith("data:image"):
            format_str, imgstr = data.split(";base64,")
            ext = format_str.split("/")[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            data = ContentFile(base64.b64decode(imgstr), name=filename)
            print(filename)
        return super().to_internal_value(data)


class ProjectSerializer(serializers.ModelSerializer):
    edit_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Project
        fields = ("id", "name", "edit_time", "fk_photoid")


class ProjectPostSerializer(serializers.ModelSerializer):
    screenPath = Base64ImageField(write_only=True, required=False)
    fk_photoid = serializers.CharField(validators=[])

    class Meta:
        model = Project
        fields = [
            "name",
            "fk_photoid",
            "offsetX",
            "offsetY",
            "scaleX",
            "scaleY",
            "screenPath",
        ]
        extra_kwargs = {"fk_photoid": {"write_only": True}}

    def validate(self, attrs):
        errors = {}

        name = attrs.get("name")
        image = attrs.get("fk_photoid")

        name_validator = Validation("name", name)
        name_validator.validate_required()
        name_validator.validate_alphanumeric_spaces()
        name_validator.validate_min_length(10)
        name_validator.validate_max_length(100)
        errors.update(name_validator.get_errors())

        image_validator = Validation("fk_photoid", image)
        image_validator.validate_required()
        image_validator.validate_object_exists(Photo, "id")
        image_validator.validate_user_owns_object(
            Photo, self.context["request"].user.id, "id"
        )
        errors.update(image_validator.get_errors())

        if errors:
            raise Exception(errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        image = validated_data.get("fk_photoid")
        offsetX = validated_data.get("offsetX")
        offsetY = validated_data.get("offsetY")
        scaleX = validated_data.get("scaleX")
        scaleY = validated_data.get("scaleY")

        photo = Photo.objects.filter(id=image).first()
        user_id = self.context["request"].user.id
        screenPath = validated_data.get("screenPath")
        filename = os.path.basename(screenPath.name)
        upload_folder = os.path.join(settings.MEDIA_ROOT, "screenshots")
        os.makedirs(upload_folder, exist_ok=True)
        image_path = os.path.join(upload_folder, filename)
        with open(image_path, "wb") as image_file:
            screenPath.seek(0)
            image_file.write(screenPath.read())
        project = Project(
            name=name,
            fk_photoid=photo,
            fk_userid_id=user_id,
            offsetX=offsetX,
            offsetY=offsetY,
            scaleX=scaleX,
            scaleY=scaleY,
            screenPath="photos/screenshots/" + filename,
        )
        project.save()
        return project
