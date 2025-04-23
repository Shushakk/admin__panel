import React, { useState, useEffect } from 'react';
import './StudentTable.css'; // Подключаем внешний CSS

function StudentAdmin() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState({ last_name: '', first_name: '', course: '', group: '', faculty: '' });
  const [newStudent, setNewStudent] = useState({
    last_name: '',
    first_name: '',
    patronymic: '',
    course: '',
    group: '',
    faculty: ''
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Загрузка студентов (GET) с пагинацией
  const fetchStudents = () => {
    fetch(`http://localhost:3000/students?page=${page}&page_size=${pageSize}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  };

  // Поиск/фильтрация студентов
  const searchStudents = () => {
    const query = new URLSearchParams(search).toString();
    fetch(`http://localhost:3000/students/search?${query}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  };

  // Добавление студента (POST)
  const addStudent = () => {
    fetch('http://localhost:3000/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    })
      .then((res) => {
        if (res.ok) {
          fetchStudents();
          setNewStudent({
            last_name: '',
            first_name: '',
            patronymic: '',
            course: '',
            group: '',
            faculty: ''
          });
        } else {
          console.error('Ошибка при добавлении');
        }
      })
      .catch((err) => console.error(err));
  };

  // Удаление студента (DELETE)
  const deleteStudent = (id) => {
    fetch(`http://localhost:3000/students/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          fetchStudents();
        } else {
          console.error('Ошибка при удалении');
        }
      })
      .catch((err) => console.error(err));
  };

  // Обновление студента (PATCH)
  const updateStudent = () => {
    fetch(`http://localhost:3000/students/${editingStudent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingStudent)
    })
      .then((res) => {
        if (res.ok) {
          setEditingStudent(null);
          fetchStudents();
        } else {
          console.error('Ошибка при обновлении');
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize]);

  return (
    <div className="container">
      <h1>Управление студентами</h1>

      {/* Поиск студентов */}
      <section className="search-section">
        <h2>Поиск студентов</h2>
        <input
          type="text"
          placeholder="Фамилия"
          value={search.last_name}
          onChange={(e) => setSearch({ ...search, last_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Имя"
          value={search.first_name}
          onChange={(e) => setSearch({ ...search, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Отчество"
          value={search.patronymic}
          onChange={(e) => setSearch({ ...search, patronymic: e.target.value })}
        />
        <input
          type="text"
          placeholder="Курс"
          value={search.course}
          onChange={(e) => setSearch({ ...search, course: e.target.value })}
          style={{ maxWidth: '70px' }}
        />
        <input
          type="text"
          placeholder="Группа"
          value={search.group}
          onChange={(e) => setSearch({ ...search, group: e.target.value })}
        />
        <input
          type="text"
          placeholder="Факультет"
          value={search.faculty}
          onChange={(e) => setSearch({ ...search, faculty: e.target.value })}
        />
        <button onClick={searchStudents}>Найти</button>
      </section>

      {/* Добавление студента */}
      <section className="add-section">
        <h2>Добавить студента</h2>
        <input
          type="text"
          placeholder="Фамилия"
          value={newStudent.last_name}
          onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Имя"
          value={newStudent.first_name}
          onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Отчество"
          value={newStudent.patronymic}
          onChange={(e) => setNewStudent({ ...newStudent, patronymic: e.target.value })}
        />
        <input
          type="text"
          placeholder="Курс"
          value={newStudent.course}
          onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
          style={{ maxWidth: '70px' }}
          />
        <input
        type="text"
        placeholder="Группа"
        value={newStudent.group}
        onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
        />
        <input
        type="text"
        placeholder="Факультет"
        value={newStudent.faculty}
        onChange={(e) => setNewStudent({ ...newStudent, faculty: e.target.value })}
        />
        <button onClick={addStudent}>Добавить</button>
      </section>

      {/* Таблица студентов */}
      <section className="table-section">
        <h2>Список студентов</h2>
        <table>
          <thead>
            <tr>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>Курс</th>
              <th>Группа</th>
              <th>Факультет</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) =>
              editingStudent && editingStudent.id === student.id ? (
                <tr key={student.id}>
                  <td>
                    <input
                      type="text"
                      value={editingStudent.last_name}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, last_name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingStudent.first_name}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, first_name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingStudent.patronymic}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, patronymic: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                    type="text"
                    value={editingStudent.course}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, course: e.target.value })
                    }
                    style={{ maxWidth: '70px' }}
                    />
                    </td>
                    <td>
                      <input
                      type="text"
                      value={editingStudent.group}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, group: e.target.value })
                      }
                      />
                      </td>
                      <td>
                        <input
                        type="text"
                        value={editingStudent.faculty}
                        onChange={(e) =>
                          setEditingStudent({ ...editingStudent, faculty: e.target.value })
                        }
                        />
                        </td>
                        <td>
                          <button onClick={updateStudent}>Сохранить</button>
                          <button onClick={() => setEditingStudent(null)}>Отмена</button>
                          </td>
                          </tr>
                          ) : (
                          <tr key={student.id}>
                            <td>{student.last_name}</td>
                            <td>{student.first_name}</td>
                            <td>{student.patronymic}</td>
                            <td>{student.course}</td>
                            <td>{student.group}</td>
                            <td>{student.faculty}</td>
                            <td>
                              <button onClick={() => setEditingStudent(student)}>Редактировать</button>
                              <button onClick={() => deleteStudent(student.id)}>Удалить</button>
                              </td>
                              </tr>
                              )
                            )}
                            </tbody>
                            </table>
                            <div className="pagination">
                              <button onClick={() => setPage(page > 1 ? page - 1 : 1)}>Предыдущая</button>
                              <span>Страница {page}</span>
                              <button onClick={() => setPage(page + 1)}>Следующая</button>
                              <label>
                                Размер страницы:
                                <select
                                value={pageSize}
                                onChange={(e) => {
                                  setPageSize(Number(e.target.value));
                                  setPage(1);
                                }}
                                >
                                  <option value="1">1</option>
                                  <option value="5">5</option>
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  </select>
                                  </label>
                                  </div>
                                  </section>
                                  </div>
                                  );
                                }
                                export default StudentAdmin;
