from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import os
import time
from sqlalchemy.exc import OperationalError

# MySQL connection string
myuser = os.getenv("MYSQL_USER")
mypassword = os.getenv("MYSQL_PASSWORD")
port = os.getenv("MYSQL_PORT")
dbname = os.getenv("MYSQL_DATABASE")
DATABASE_URL = f"mysql+pymysql://{myuser}:{mypassword}@mysql:{port}/{dbname}"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # ensures connection is alive
    pool_recycle=3600,       # avoids MySQL server has gone away
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

class ContactMessage(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50))
    email = Column(String(100))
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)


def init_db():
    for attempt in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            print("Database initialized.")
            return
        except OperationalError as e:
            print(f"MySQL not ready (attempt {attempt+1}/10). Retrying...")
            time.sleep(3)
    raise RuntimeError("Could not connect to MySQL after multiple attempts.")

