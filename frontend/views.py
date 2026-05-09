from pathlib import Path

from django.conf import settings
from django.shortcuts import render

# Create your views here.

def index(request, *args, **kwargs):
    main_bundle = Path(settings.BASE_DIR) / "frontend" / "static" / "frontend" / "main.js"
    static_version = int(main_bundle.stat().st_mtime) if main_bundle.exists() else 1
    return render(request, 'frontend/index.html', {'static_version': static_version})
