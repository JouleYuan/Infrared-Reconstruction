import os
import glob
import json

from werkzeug.serving import run_simple
from werkzeug.wrappers import Request, Response
from werkzeug.routing import Map, Rule
from werkzeug.exceptions import HTTPException
from werkzeug.formparser import parse_form_data

from MVS import MVS
from SfM import SfM
from texture import texture
from const import ROOT_PATH, VISIBLE_PATH, INFRARED_PATH, MVS_PATH

class WSGI(object):

    def __init__(self):
        self.url_map = Map([
            Rule('/sfm', endpoint='sfm'),
            Rule('/mvs', endpoint='mvs'),
            Rule('/texture', endpoint='texture'),
            Rule('/file/visible', endpoint='upload_visible'),
            Rule('/file/infrared', endpoint='upload_infrared'),
            Rule('/project/detail', endpoint='project_detail')
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

    def on_upload_visible(self, request):
        _, form, files = parse_form_data(request.environ)
        image = files["file"]
        project_id = form["project_id"]

        image_path = os.path.join(ROOT_PATH, VISIBLE_PATH, str(project_id))
        if not os.path.isdir(image_path):
            return Response(json.dumps({"ok": False}), content_type="application/json")
        image.save(os.path.join(image_path, image.filename))
        return Response(json.dumps({"ok": True}), content_type="application/json")

    def on_upload_infrared(self, request):
        _, form, files = parse_form_data(request.environ)
        image = files["file"]
        project_id = form["project_id"]

        if not image.filename.endswith(".jpg"):
            return Response(json.dumps({"ok": False}), content_type="application/json")
        image_path = os.path.join(ROOT_PATH, INFRARED_PATH, str(project_id))
        if not os.path.isdir(image_path):
            return Response(json.dumps({"ok": False}), content_type="application/json")
        image.save(os.path.join(image_path, image.filename))
        return Response(json.dumps({"ok": True}), content_type="application/json")
    
    def on_project_detail(self, request):
        req = request.get_json()
        visible_path = os.path.join(ROOT_PATH, VISIBLE_PATH, str(req["project_id"]))
        infrared_path = os.path.join(ROOT_PATH, INFRARED_PATH, str(req["project_id"]))
        model_path = os.path.join(ROOT_PATH, MVS_PATH, str(req["project_id"]))
        visible_image_list = glob.glob(visible_path + "/*.jpg")
        infrared_image_list = glob.glob(infrared_path + "/*.jpg")
        model_list = glob.glob(model_path + "/*.mvs") + glob.glob(model_path + "/*.ply") + glob.glob(model_path + "/*.png")
        for i in range(len(visible_image_list)):
            visible_image_list[i] = os.path.basename(visible_image_list[i])
        for i in range(len(infrared_image_list)):
            infrared_image_list[i] = os.path.basename(infrared_image_list[i])
        for i in range(len(model_list)):
            model_list[i] = os.path.basename(model_list[i])
        return Response(json.dumps({"visible_image": visible_image_list, "infrared_image": infrared_image_list, "model_list": model_list}), content_type="application/json")

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
