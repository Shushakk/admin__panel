from sqlalchemy.orm import Session
from . import models, schemas
from typing import Optional
from sqlalchemy import or_

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def get_students(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Student).offset(skip).limit(limit).all()

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def update_student(db: Session, student_id: int, student_data: dict):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student:
        for key, value in student_data.items():
            setattr(student, key, value)
        db.commit()
        db.refresh(student)
    return student

def delete_student(db: Session, student_id: int):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if student:
        db.delete(student)
        db.commit()
    return student

def search_students(
    db: Session, 
    last_name: Optional[str] = None, 
    first_name: Optional[str] = None,
    patronymic: Optional[str] = None,
    course: Optional[str] = None,
    group: Optional[str] = None,
    faculty: Optional[str] = None
):
    query = db.query(models.Student)
    if last_name:
        query = query.filter(models.Student.last_name.ilike(f"%{last_name}%"))
    if first_name:
        query = query.filter(models.Student.first_name.ilike(f"%{first_name}%"))
    if patronymic:
        query = query.filter(models.Student.patronymic.ilike(f"%{patronymic}%"))
    if course:
        query = query.filter(models.Student.course == course)  
    if group:
        query = query.filter(models.Student.group.ilike(f"%{group}%"))
    if group:
        query = query.filter(models.Student.group.ilike(f"%{group}%"))
    if faculty:
        query = query.filter(models.Student.faculty.ilike(f"%{faculty}%"))
    return query.all()