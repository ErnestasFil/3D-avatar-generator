from rest_framework import status
from rest_framework.permissions import BasePermission

from user.models import User
from Backend.validation import Exception

from .models import Project


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        user_id_from_request = request.user.id if request.user else None
        user_id_from_url = view.kwargs.get("user_id")
        if not User.objects.filter(id=user_id_from_url).exists():
            raise Exception({"message", "Not found"}, status.HTTP_404_NOT_FOUND)
        return user_id_from_request == user_id_from_url


class IsProjectOwner(BasePermission):
    def has_permission(self, request, view):
        user_id_from_request = request.user.id if request.user else None
        user_id_from_url = view.kwargs.get("user_id")
        project_id_from_url = view.kwargs.get("project_id")
        project = Project.objects.filter(id=project_id_from_url)
        if not project.exists():
            raise Exception({"message", "Not found"}, status.HTTP_404_NOT_FOUND)
        if not project.first().fk_userid.id == user_id_from_request:
            return False
        return user_id_from_request == user_id_from_url
