[![Join the chat at https://gitter.im/OptimalBPM/angular-schema-form-add-ons](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/OptimalBPM/angular-schema-form-add-ons?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Angular schema form add-ons - Tools

This folder contains tools for add-on development.

## create_new_add_on.py

This is a python script that copies and renames the "minimal" example and its references to create a new add-on.

Arguments:

--dest - The destination folder where the add-on creates a folder named after the --name<br />
--name - The name of the new add-on<br />
--author - The author of the new add-on<br />


Usage: `create_new_add_on.py [-h] [--dest DEST] --name NAME --author AUTHOR`

Example that creates an add-on at "~/development/test":

```bash
python3.4 create_new_add_on.py --dest=~/development --name="test" --author="test"
```
 