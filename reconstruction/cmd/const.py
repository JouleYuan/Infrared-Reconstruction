import os

ROOT_PATH = os.path.abspath("data")
VISIBLE_PATH = "image/visible"
INFRARED_PATH = "image/infrared"
SFM_PATH = "SfM"
MVS_PATH = "MVS"
TEXTURE_PATH = "Texture"

# Indicate the openMVG binary directory
OPENMVG_SFM_BIN = "/home/haoran/openMVG/build/Linux-x86_64-RELEASE"

OPENMVS_BIN="/home/haoran/openMVS/my_build/bin"

# Indicate the openMVG camera sensor width directory
CAMERA_SENSOR_WIDTH_DIRECTORY = "/home/haoran/openMVG/src/software/SfM" + "/../../openMVG/exif/sensor_width_database"