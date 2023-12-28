import os

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Photo
from .permissions import IsImageOwner, IsOwner
from .serializers import ImagePostSerializer, PhotoSerializer


class ImageListCreateView(APIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, user_id, format=None):
        self.check_object_permissions(request, user_id)

        queryset = Photo.objects.filter(fk_userid_id=user_id)

        serializer = PhotoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id, format=None):
        self.check_object_permissions(request, user_id)
        serializer = ImagePostSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        image = serializer.save()
        image_data = PhotoSerializer(image).data
        if image_data:
            response_data = image_data
        response_data["message"] = "Image upload successful"
        return Response(response_data, status=status.HTTP_201_CREATED)


class ImageDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsOwner, IsImageOwner]

    def check_object_permissions(self, request):
        IsOwner().has_permission(request, self)
        IsImageOwner().has_permission(request, self)

    def delete(self, request, user_id, image_id, format=None):
        self.check_object_permissions(request)

        image = Photo.objects.filter(id=image_id, fk_userid=user_id).first()
        if image:
            image_path = image.path
            try:
                os.remove(image_path)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
            image.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
