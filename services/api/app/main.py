from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Admin API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/students", response_model=list[schemas.Student])
def read_students(
    page: int = 1, 
    page_size: int = 10, 
    db: Session = Depends(get_db)
):
    if page < 1 or page_size < 1:
        raise HTTPException(status_code=400, detail="Неверные параметры пагинации")
    skip = (page - 1) * page_size
    students = crud.get_students(db, skip=skip, limit=page_size)
    return students

# Эндпоинт для поиска и фильтрации по полям (GET)
@app.get("/students/search", response_model=list[schemas.Student])
def search_students(
    last_name: Optional[str] = Query(None, description="Фильтр по фамилии"),
    first_name: Optional[str] = Query(None, description="Фильтр по имени"),
    patronymic: Optional[str] = Query(None, description="Фильтр по отчеству"),
    course: Optional[str] = Query(None, description="Фильтр по курсу"),
    group: Optional[str] = Query(None, description="Фильтр по группе"),
    faculty: Optional[str] = Query(None, description="Фильтр по факультету"),
    db: Session = Depends(get_db)
):
    students = crud.search_students(
        db,
        last_name=last_name,
        first_name=first_name,
        patronymic=patronymic,
        course=course,
        group=group,
        faculty=faculty
    )
    return students

# Создание новой записи (POST)
@app.post("/students", response_model=schemas.Student, status_code=201)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db, student=student)

# Редактирование (обновление) любого поля (PATCH)
@app.patch("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    updated_student = crud.update_student(db, student_id, student.dict(exclude_unset=True))
    if not updated_student:
        raise HTTPException(status_code=404, detail="Студент не найден")
    return updated_student

# Удаление записи (DELETE)
@app.delete("/students/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = crud.delete_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Студент не найден")
    return None