from django.http import JsonResponse


class ErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if response.status_code == 404:
            return JsonResponse({"message": "Not found"}, status=404)
        # elif response.status_code == 403:
        #     return JsonResponse({"message": "Forbidden"}, status=403)
        elif response.status_code == 405:
            return JsonResponse({"message": "Method not allowed"}, status=405)
        return response
