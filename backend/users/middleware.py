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