from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import UserLoginView, UserRegistrationView

urlpatterns = [
    path("register", UserRegistrationView.as_view(), name="register"),
    path("login", UserLoginView.as_view(), name="login"),
    path("verify", TokenVerifyView.as_view(), name="token_verify"),
    path("refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/<int:user_id>/", include("images.urls")),
    path("user/<int:user_id>/", include("project.urls")),
]
