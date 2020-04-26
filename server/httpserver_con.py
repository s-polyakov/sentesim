from httpserver import app
from aiohttp import web

from config import Config


if __name__ == "__main__":
    web.run_app(app, host=Config.host, port=Config.port)
