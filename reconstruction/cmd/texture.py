import os
import subprocess
import glob
import shutil

from const import INFRARED_PATH, ROOT_PATH, MVS_PATH, OPENMVS_BIN

def texture(project_id):
    infrared_dir = os.path.join(ROOT_PATH, INFRARED_PATH, str(project_id))
    mvs_dir = os.path.join(ROOT_PATH, MVS_PATH, str(project_id))
    if not (os.path.isdir(infrared_dir) and os.path.isdir(mvs_dir)):
        return False

    out_image_list = glob.glob(mvs_dir + "/*.jpg")
    infrared_image_list = glob.glob(infrared_dir + "/*.jpg")
    for out_image in out_image_list:
        shutil.rmtree(out_image, ignore_errors=True)
    for infrared_image in infrared_image_list:
        shutil.copy(infrared_image, mvs_dir)

    print ("1. Texture Mesh")
    pSequentialDensify = subprocess.Popen( [os.path.join(OPENMVS_BIN, "TextureMesh"),  mvs_dir + "/scene_dense_mesh.mvs"] )
    pSequentialDensify.wait()

    log_file_list = glob.glob("./*.log")
    for log_file in log_file_list:
        shutil.rmtree(log_file, ignore_errors=True)

    return True
