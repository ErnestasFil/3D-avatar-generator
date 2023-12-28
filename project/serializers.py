from django.conf import settings
from rest_framework import serializers, status

from Backend.validation import Exception, Validation
from images.models import Photo

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    edit_time = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Project
        fields = ("id", "name", "edit_time", "fk_photoid")


class ProjectPostSerializer(serializers.ModelSerializer):
    fk_photoid = serializers.CharField(validators=[])

    class Meta:
        model = Project
        fields = ["name", "fk_photoid"]
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
        photo = Photo.objects.filter(id=image).first()
        user_id = self.context["request"].user.id
        project = Project(name=name, fk_photoid=photo, fk_userid_id=user_id)
        project.save()
        return project
