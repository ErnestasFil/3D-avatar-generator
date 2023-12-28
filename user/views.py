from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    EmailAuthBackend,
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user_data = UserSerializer(user).data
        if user_data:
            response_data = user_data
        response_data["message"] = "Registration successful"
        return Response(response_data, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")
        user = EmailAuthBackend().authenticate(request, email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            return Response(
                {
                    "access-token": token["access"],
                    "refresh-token": token["refresh"],
                    "message": "Login success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"errors": ["Email or Password is not Valid"]},
                status=status.HTTP_401_UNAUTHORIZED,
            )
