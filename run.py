from app import app
from settings import API_HOST, API_PORT

if __name__ == '__main__':
    app.debug=True
    app.run(host=API_HOST, port=API_PORT)
    app.run()