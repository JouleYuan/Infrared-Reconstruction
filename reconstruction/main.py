from werkzeug.serving import run_simple
from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound

from cmd.MVS import MVS
from cmd.SfM import SfM
from cmd.texture import texture

class WSGI(object):

    def __init__(self):
        self.url_map = Map([
            Rule('/sfm', endpoint='sfm'),
            Rule('/mvs', endpoint='mvs'),
            Rule('/texture', endpoint='texture'),
        ])

    def on_sfm(self, request):
        json = request.get_json()
        if SfM(json["project_id"], "sequential"):
            return Response("ok")
        return Response("not ok")

    def on_mvs(self, request):
        json = request.get_json()
        if MVS(json["project_id"]):
            return Response("ok")
        return Response("not ok")

    def on_texture(self, request):
        json = request.get_json()
        if texture(json["project_id"]):
            return Response("ok")
        return Response("not ok")

    def dispatch_request(self, request):
        adapter = self.url_map.bind_to_environ(request.environ)
        try:
            endpoint, values = adapter.match()
            print(values)
            return getattr(self, f'on_{endpoint}')(request, **values)
        except HTTPException as e:
            return e

    def wsgi_app(self, environ, start_response):
        request = Request(environ)
        response = self.dispatch_request(request)
        return response(environ, start_response)

    def __call__(self, environ, start_response):
        return self.wsgi_app(environ, start_response)

def create_app():
    app = WSGI()
    return app

if __name__ == '__main__':
    app = create_app()
    run_simple('0.0.0.0', 8080, app, use_debugger=True, use_reloader=True)
