from app import app
from settings import HOST, PORT

if __name__ == '__main__':
    app.debug=True
    app.run(host=HOST, port=PORT)
    app.run()