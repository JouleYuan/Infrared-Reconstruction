import os
import subprocess
import glob
import shutil

from const import ROOT_PATH, MVS_PATH, OPENMVS_BIN

def MVS(project_id) -> bool:
    mvs_dir = os.path.join(ROOT_PATH, MVS_PATH, str(project_id))
    if not os.path.isdir(mvs_dir):
        return False
    
    print ("1. Densify Point Cloud")
    pSequentialDensify = subprocess.Popen( [os.path.join(OPENMVS_BIN, "DensifyPointCloud"), mvs_dir + "/scene.mvs"] )
    pSequentialDensify.wait()

    print ("2. Reconstruct Mesh")
    pSequentialDensify = subprocess.Popen( [os.path.join(OPENMVS_BIN, "ReconstructMesh"),  mvs_dir + "/scene_dense.mvs"] )
    pSequentialDensify.wait()

    log_file_list = glob.glob("./*.log")
    dmap_file_list = glob.glob("./*.dmap")
    for log_file in log_file_list:
        shutil.rmtree(log_file, ignore_errors=True)
    for dmap_file in dmap_file_list:
        shutil.rmtree(dmap_file, ignore_errors=True)

    return True
