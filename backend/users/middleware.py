class LogUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Access the user associated with the request
        user = getattr(request, 'user', None)

        if user and user.is_authenticated:
            print(f"User: {user.get_full_name()} ({user.email})")  # Customize output as needed

        else:
          print(user)

        response = self.get_response(request)
        return response


from django.conf import settings
# from django.utils.deprecation import MiddlewareMixin
import json


class MoveJWTRefreshCookieIntoTheBody:
    """
    for Django Rest Framework JWT's POST "/token-refresh" endpoint --- check for a 'token' in the request.COOKIES
    and if, add it to the body payload.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, *view_args, **view_kwargs):
        if request.path == '/auth/token/refresh/' and settings.JWT_AUTH_REFRESH_COOKIE in request.COOKIES:

            if request.body != b'':
                data = json.loads(request.body)
                data['refresh'] = request.COOKIES[settings.JWT_AUTH_REFRESH_COOKIE]
                request._body = json.dumps(data).encode('utf-8')
            else:
                # I cannot create a body if it is not passed so the client must send '{}'
                pass

        return None
