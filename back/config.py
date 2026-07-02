import os
from pathlib import Path

basedir      = Path(__file__).resolve().parent
instance_dir = basedir / 'instance'
instance_dir.mkdir(exist_ok=True)

# 모든 가능한 방법으로 DATABASE_URL 읽기
_db_url = (
    os.environ.get('DATABASE_URL') or
    os.environ.get('SQLALCHEMY_DATABASE_URI') or
    ''
)

print(f"[CONFIG] DB URL: {_db_url[:40] if _db_url else 'NOT SET - using SQLite'}")

if _db_url.startswith('postgres://'):
    _db_url = _db_url.replace('postgres://', 'postgresql://', 1)

class Config:
    SECRET_KEY     = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-key'
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') or ''

    SQLALCHEMY_DATABASE_URI = _db_url or (
        'sqlite:///' + str(instance_dir / 'dining.db').replace('\\', '/')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle':  300,
    }
