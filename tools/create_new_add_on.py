import os
import shutil
import argparse
from shutil import ignore_patterns
from lib.mass_replace import mass_replace

__author__ = 'Nicklas Boerjesson'

script_dir = os.path.dirname(__file__)

parser = argparse.ArgumentParser(description='Creates a new add-on with the supplied name and author',
                                 epilog="")
parser.add_argument('--dest', required=False, help='Destination folder')
parser.add_argument('--name', required=True, help='Project name')
parser.add_argument('--author', required=True, help='The name of the author')

_arguments = vars(parser.parse_args())

_destination = _arguments["dest"]
_add_on_name = _arguments["name"]
_add_on_author = _arguments["author"]

if _destination is None:
    _destination = os.getcwd()
else:
    _destination = os.path.expanduser(_destination)

_destination = os.path.join(_destination, _add_on_name)

if os.path.exists(_destination):
    raise Exception("The destination already exists.")

_source_folder = os.path.join(script_dir, "..", "examples", "minimal")



# Copy to destination
shutil.copytree(src=_source_folder, dst=_destination,
                ignore=ignore_patterns('bower_components', 'node_modules', "README.md"))

# Add README
shutil.copy(src=os.path.join(script_dir, "README_new_add_on.md"), dst=os.path.join(_destination,"README.md"))

# Create needed variations of the add-on name:

# First, the add-on name should only be word-separated by "-".
_add_on_name = _add_on_name.replace(" ", "-").replace("_", "-")

# JS names should be camelCase:d and contain no "-"
_cc_tmp = ''.join(x for x in _add_on_name.title() if x.isalpha())
_camelCased_add_on_name = (_cc_tmp[0].lower() + _cc_tmp[1:]).replace("-", "")

# References cannot contain any "-"
_references_add_on_name = _add_on_name.replace("_", "").replace("-", "")

# Actually replace the strings in all the files

# Replace all the capitalized Minimal mentions
mass_replace(_destination, "Minimal", _add_on_name.capitalize())

# Replace all the minimalForm type references minimal mentions with camelCase:d _add_on_name
mass_replace(_destination, "minimalForm", _camelCased_add_on_name + "Form")

# Replace all the html file references with lowercase _add_on_name
mass_replace(_destination, "angular-schema-form-minimal", "angular-schema-form-" + _add_on_name.lower())

# Replace all the destination_folders references with lowercase _add_on_name
mass_replace(_destination, "destination_folder", _add_on_name.lower())


# Replace all the remaining lowercase(references) minimal mentions
mass_replace(_destination, "minimal", _references_add_on_name.lower())

# Replace all the Optimal BPM mentions
mass_replace(_destination, "Optimal BPM", _add_on_author)

# Rename all the files
shutil.move(src=os.path.join(_destination, "src", "angular-schema-form-minimal.html"),
            dst=os.path.join(_destination, "src", "angular-schema-form-" + _add_on_name.lower() + ".html"))
shutil.move(src=os.path.join(_destination, "src", "angular-schema-form-minimal.js"),
            dst=os.path.join(_destination, "src", "angular-schema-form-" + _add_on_name.lower() + ".js"))
shutil.move(src=os.path.join(_destination, "angular-schema-form-minimal.js"),
            dst=os.path.join(_destination, "angular-schema-form-" + _add_on_name.lower() + ".js"))
shutil.move(src=os.path.join(_destination, "angular-schema-form-minimal.min.js"),
            dst=os.path.join(_destination, "angular-schema-form-" + _add_on_name.lower() + ".min.js"))


print("If you want to, you can initialize the add on using these commands:")
print("cd " + _destination)
print("sudo npm install bower")
print("node_modules/bower/bin/bower install")
print("\nTo install the build tools like this:")
print("sudo npm install")
