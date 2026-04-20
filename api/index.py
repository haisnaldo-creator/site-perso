"""
Point d'entrée serverless pour Vercel.
Vercel détecte automatiquement la variable `app` ASGI et la sert.
"""
import os
import sys

# Rend le dossier backend/ importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from server import app  # noqa: F401,E402
