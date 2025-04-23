from sqlalchemy import Column, Integer, String
from .database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String, nullable=False)      # Фамилия
    first_name = Column(String, nullable=False)     # Имя
    patronymic = Column(String, nullable=True)        # Отчество
    course = Column(Integer, nullable=False)          # Курс
    group = Column(String, nullable=False)            # Группа
    faculty = Column(String, nullable=False)          # Факультет