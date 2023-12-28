import os

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project
from .permissions import IsOwner, IsProjectOwner
from .serializers import ProjectPostSerializer, ProjectSerializer


class ProjectListCreateView(APIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, user_id, format=None):
        self.check_object_permissions(request, user_id)

        queryset = Project.objects.filter(fk_userid_id=user_id)

        serializer = ProjectSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id, format=None):
        self.check_object_permissions(request, user_id)
        serializer = ProjectPostSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        project_data = ProjectSerializer(project).data
        if project_data:
            response_data = project_data
        response_data["message"] = "Project created successful"
        return Response(response_data, status=status.HTTP_201_CREATED)


class ProjectDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsOwner, IsProjectOwner]

    def check_object_permissions(self, request):
        IsOwner().has_permission(request, self)
        IsProjectOwner().has_permission(request, self)

    def delete(self, request, user_id, project_id, format=None):
        self.check_object_permissions(request)

        project = Project.objects.filter(id=project_id, fk_userid=user_id).first()
        if project:
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
