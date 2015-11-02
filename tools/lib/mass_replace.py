# Written by Steve R. Hastings, on stack overflow: http://stackoverflow.com/a/1597755/4072379

import os
import re
import sys
import shutil

# list of extensions to replace
DEFAULT_REPLACE_EXTENSIONS = None
# example: uncomment next line to only replace *.c, *.h, and/or *.txt
# DEFAULT_REPLACE_EXTENSIONS = (".c", ".h", ".txt")

def try_to_replace(fname, replace_extensions=DEFAULT_REPLACE_EXTENSIONS):
    if replace_extensions:
        return fname.lower().endswith(replace_extensions)
    return True


def file_replace(fname, pat, s_after):
    # first, see if the pattern is even in the file.
    with open(fname) as f:
        if not any(re.search(pat, line) for line in f):
            return # pattern does not occur in file so we are done.

    # pattern is in the file, so perform replace operation.
    with open(fname) as f:
        out_fname = fname + ".tmp"
        out = open(out_fname, "w")
        for line in f:
            out.write(re.sub(pat, s_after, line))
        out.close()
        shutil.move(out_fname, fname)


def mass_replace(dir_name, s_before, s_after, replace_extensions=DEFAULT_REPLACE_EXTENSIONS):
    pat = re.compile(s_before)
    for dirpath, dirnames, filenames in os.walk(dir_name):
        for fname in filenames:
            if try_to_replace(fname, replace_extensions):
                fullname = os.path.join(dirpath, fname)
                file_replace(fullname, pat, s_after)
