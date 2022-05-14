import os
import pathlib
import subprocess
import json
import shutil

from const import VISIBLE_PATH, ROOT_PATH, SFM_PATH, MVS_PATH, CAMERA_SENSOR_WIDTH_DIRECTORY, OPENMVG_SFM_BIN


def SfM(project_id, algo) -> bool:
    input_dir = os.path.join(ROOT_PATH, VISIBLE_PATH, str(project_id))
    matches_dir = os.path.join(ROOT_PATH, SFM_PATH, "matches", str(project_id))
    reconstruction_dir = os.path.join(ROOT_PATH, SFM_PATH, "reconstruction", str(project_id))
    mvs_dir = os.path.join(ROOT_PATH, MVS_PATH, str(project_id))
    shutil.rmtree(matches_dir, ignore_errors=True)
    shutil.rmtree(reconstruction_dir, ignore_errors=True)
    shutil.rmtree(mvs_dir, ignore_errors=True)
    pathlib.Path(matches_dir).mkdir(parents=True, exist_ok=True)
    pathlib.Path(reconstruction_dir).mkdir(parents=True, exist_ok=True)
    pathlib.Path(mvs_dir).mkdir(parents=True, exist_ok=True)
    
    camera_file_params = os.path.join(CAMERA_SENSOR_WIDTH_DIRECTORY, "sensor_width_camera_database.txt")

    print ("1. Intrinsics analysis")
    pIntrisics = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"),  "-i", input_dir, "-o", matches_dir, "-d", camera_file_params, "-c", "3"] )
    pIntrisics.wait()

    with open(os.path.join(matches_dir, "sfm_data.json"), "r+") as json_file:
        data = json.load(json_file)
        if not data["views"]:
            return False
        if not data["intrinsics"]:
            for i in range(len(data["views"])):
                data["views"][i]["value"]["ptr_wrapper"]["data"]["id_intrinsic"] = 0

            first = data["views"][0]["value"]
            last = data["views"][-1]["value"]
            
            data["intrinsics"].append(json.loads('{{\
                "key": 0,\
                "value": {{\
                    "polymorphic_id": {},\
                    "polymorphic_name": "pinhole_radial_k3",\
                    "ptr_wrapper": {{\
                        "id": {},\
                        "data": {{\
                            "width": {},\
                            "height": {},\
                            "focal_length": {},\
                            "principal_point": [\
                                {},\
                                {}\
                            ],\
                            "disto_k3": [\
                                0.0,\
                                0.0,\
                                0.0\
                            ]\
                        }}\
                    }}\
                }}\
            }}'.format(first["ptr_wrapper"]["id"], last["ptr_wrapper"]["id"] + 1, first["ptr_wrapper"]["data"]["width"], first["ptr_wrapper"]["data"]["height"],
            float(first["ptr_wrapper"]["data"]["width"] / 2.0), float(first["ptr_wrapper"]["data"]["width"]), float(first["ptr_wrapper"]["data"]["height"]))))

            json_file.seek(0)
            json.dump(data, json_file, indent=4)
            json_file.truncate()
    
    print ("2. Compute features")
    pFeatures = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeFeatures"),  "-i", matches_dir+"/sfm_data.json", "-o", matches_dir, "-m", "SIFT", "-f" , "1"] )
    pFeatures.wait()

    print ("3. Compute matches")
    pMatches = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeMatches"),  "-i", matches_dir+"/sfm_data.json", "-o", matches_dir+"/matches.putative.bin", "-f", "1", "-n", "ANNL2"] )
    pMatches.wait()

    if algo == "sequential":
        print ("4. Filter matches" )
        pFiltering = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_GeometricFilter"), "-i", matches_dir+"/sfm_data.json", "-m", matches_dir+"/matches.putative.bin" , "-g" , "f" , "-o" , matches_dir+"/matches.f.bin" ] )
        pFiltering.wait()

        print ("5. Do Incremental/Sequential reconstruction") #set manually the initial pair to avoid the prompt question
        pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfM"), "--sfm_engine", "INCREMENTAL", "--input_file", matches_dir+"/sfm_data.json", "--match_dir", matches_dir, "--output_dir", reconstruction_dir] )
        pRecons.wait()
    
    if algo == "global":
        print ("4. Filter matches")
        pFiltering = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_GeometricFilter"), "-i", matches_dir+"/sfm_data.json", "-m", matches_dir+"/matches.putative.bin" , "-g" , "e" , "-o" , matches_dir+"/matches.e.bin" ] )
        pFiltering.wait()

        print ("5. Do Global reconstruction")
        pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfM"), "--sfm_engine", "GLOBAL", "--input_file", matches_dir+"/sfm_data.json", "--match_file", matches_dir+"/matches.e.bin", "--output_dir", reconstruction_dir] )
        pRecons.wait()
    
    # 6 and 7 might be useless
    """print ("6. Colorize Structure")
    pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeSfM_DataColor"),  "-i", reconstruction_dir+"/sfm_data.bin", "-o", os.path.join(reconstruction_dir,"colorized.ply")] )
    pRecons.wait()

    print ("7. Structure from Known Poses (robust triangulation)")
    pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeStructureFromKnownPoses"),  "-i", reconstruction_dir+"/sfm_data.bin", "-m", matches_dir, "-o", os.path.join(reconstruction_dir,"robust.ply")] )
    pRecons.wait()"""

    print ("6. Sequential transformation")
    pSequential = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_openMVG2openMVS"),  "-i", reconstruction_dir + "/sfm_data.bin", "-o", mvs_dir + "/scene.mvs", "-d", mvs_dir] )
    pSequential.wait()

    return True
