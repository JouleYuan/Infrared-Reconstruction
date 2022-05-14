from concurrent import futures
 
import grpc
import proto.reconstruction_pb2 as pb
import proto.reconstruction_pb2_grpc as rpc

class Greeter(rpc.ReconstructionServicer):
    def SfM(self, request, context):
        return pb.SfMReply(ok=request.userid==1)

    def MVS(self, request, context):
        return pb.MVSReply(ok=request.userid==1)

    def Texture(self, request, context):
        return pb.TextureReply(ok=request.userid==1)
 

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=1))
    rpc.add_ReconstructionServicer_to_server(Greeter(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()
 
if __name__ == '__main__':
    serve()

"""from werkzeug.serving import run_simple
from werkzeug.urls import url_parse
from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException, NotFound
from werkzeug.utils import redirect

class WSGI(object):

    def __init__(self):
        self.url_map = Map([
            Rule('/sfm', endpoint='sfm'),
            Rule('/mvs', endpoint='mvs'),
            Rule('/texture', endpoint='texture'),
        ])

    def on_sfm(self, request):
        return Response('sfm\n')

    def on_mvs(self, request):
        return Response('mvs\n')

    def on_texture(self, request):
        return Response('texture\n')

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
    run_simple('127.0.0.1', 5000, app, use_debugger=True, use_reloader=True)"""