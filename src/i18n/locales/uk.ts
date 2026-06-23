export default {
  nav: { projects: 'Проекти', tagline: 'Управління проектами і завданнями' },
  footer: { stack: 'Стек технологій' },

  confirm: {
    cancel: 'Скасувати',
    ok: 'Підтвердити',
    archiveTitle: 'Архівувати проект',
    archiveMsg: 'Проект буде переміщено до архіву. Ви зможете відновити його пізніше.',
    restoreTitle: 'Відновити проект',
    restoreMsg: 'Проект буде повернуто до активних і знову з\'явиться у списку.',
    deleteTitle: 'Видалити проект',
    deleteMsg: 'Цю дію неможливо скасувати. Проект та всі його завдання будуть видалені назавжди.',
    deleteTaskTitle: 'Видалити завдання',
    deleteTaskMsg: 'Цю дію неможливо скасувати. Завдання буде видалено назавжди.',
  },
  lang: { switch: 'EN', current: 'УК' },

  home: {
    headlineMain: 'Управління',
    headlineItalic: 'проектами',
    sub: 'Всі проекти та завдання в одному місці — з чіткими пріоритетами та контролем дедлайнів.',
    sectionTitle: 'Проекти',
    addProject: 'Додати проект',
    newProject: 'Новий проект',
  },

  project: {
    backTo: 'Проекти',
    addTask: 'Додати завдання',
    newTask: 'Нове завдання',
    viewTable: 'Таблиця',
    viewKanban: 'Канбан',
  },

  projectForm: {
    name: 'Назва проекту',
    namePlaceholder: "Введіть назву проекту",
    description: 'Опис проекту',
    descPlaceholder: "Короткий опис (необов'язково)",
    cancel: 'Скасувати',
    save: 'Зберегти проект',
    nameLength: 'Від 2 до 100 символів',
  },

  taskForm: {
    name: 'Назва завдання',
    namePlaceholder: 'Введіть назву завдання',
    status: 'Статус',
    statusPlaceholder: 'Оберіть статус',
    assignee: 'Виконавець',
    noAssignee: 'Без виконавця',
    dueDate: 'Термін виконання',
    cancel: 'Скасувати',
    save: 'Зберегти завдання',
    nameRequired: 'Поле обов\'язкове',
    nameLength: 'Від 3 до 120 символів',
    statusRequired: 'Оберіть статус',
    dateRequired: 'Вкажіть дату',
    datePast: 'Дата не може бути в минулому',
  },

  table: {
    projects: {
      search: 'Пошук за назвою...',
      allStatuses: 'Всі статуси',
      id: 'ID',
      name: 'Назва',
      tasks: 'Завдань',
      status: 'Статус',
      created: 'Дата створення',
      empty: 'Проектів не знайдено',
      deleteConfirm: 'Видалити проект?',
      archiveConfirm: 'Архівувати проект?',
      archive: 'Архівувати',
      restore: 'Відновити',
    },
    tasks: {
      search: 'Пошук за виконавцем...',
      allStatuses: 'Всі статуси',
      id: 'ID',
      name: 'Назва',
      assignee: 'Виконавець',
      status: 'Статус',
      due: 'Термін',
      empty: 'Завдань не знайдено',
    },
  },

  status: {
    active: 'Активний',
    archived: 'Архівний',
    todo: 'До виконання',
    in_progress: 'В процесі',
    done: 'Завершено',
  },
  statusFilter: {
    active: 'Активні',
    archived: 'Архівні',
  },

  kanban: {
    todo: 'До виконання',
    in_progress: 'В процесі',
    done: 'Завершено',
  },

  stats: {
    projects: 'проектів',
    active: 'Активні',
    archived: 'Архівні',
    totalTasks: 'Завдань всього',
  },

  toast: {
    projectCreated: 'Проект успішно створено',
    projectUpdated: 'Проект оновлено',
    projectArchived: 'Проект архівовано',
    projectRestored: 'Проект відновлено',
    projectDeleted: 'Проект видалено',
    taskCreated: 'Завдання успішно додано',
    taskDeleted: 'Завдання видалено',
  },
}
