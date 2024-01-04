import imp

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("user.urls")),
    path("", TemplateView.as_view(template_name="index.html")),
    path("login", TemplateView.as_view(template_name="index.html")),
    path("register", TemplateView.as_view(template_name="index.html")),
    path("image_list", TemplateView.as_view(template_name="index.html")),
    path("project_list", TemplateView.as_view(template_name="index.html")),
    path("scene", TemplateView.as_view(template_name="index.html")),
    path("scene/<int:projectId>", TemplateView.as_view(template_name="index.html")),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
