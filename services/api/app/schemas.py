from pydantic import BaseModel
from typing import Optional

class StudentBase(BaseModel):
    last_name: str
    first_name: str
    patronymic: str = None
    course: int
    group: str
    faculty: str

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    patronymic: Optional[str] = None
    course: Optional[int] = None
    group: Optional[str] = None
    faculty: Optional[str] = None

class Student(StudentBase):
    id: int

    class Config:
       from_attributes = True