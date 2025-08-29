#!/usr/bin/env python3
"""
Windows-compatible RQ worker runner
"""
import os
import sys
import logging
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Set up environment
os.environ.setdefault('PYTHONPATH', str(project_root))

from app.workers.worker import main

if __name__ == '__main__':
    main()