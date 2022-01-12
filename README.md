# Pizza-Ordering-System

A pizza ordering system for a pizza business.

## Virtual Environment Setup
1. `pip install pipenv` - download `pipenv` package if not installed
2. `pipenv install` - install from Pipfile
3. `pipenv shell` - to activate the virtual environment

For more info, [click here.](https://pipenv-fork.readthedocs.io/en/latest/basics.html)

## Database setup

Create a new database in your PostgreSQL server and run the sql script `qpos_database.sql`

## Configuration

RENAME the `settings_template.py` to `settings.py` and fill-in the necessary configurations.

## Run

`python run.py` to run the web application.