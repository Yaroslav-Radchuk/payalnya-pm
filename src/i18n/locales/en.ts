export default {
  nav: { projects: 'Projects', tagline: 'Project and task management' },
  footer: { stack: 'Tech stack' },

  confirm: {
    cancel: 'Cancel',
    ok: 'Confirm',
    archiveTitle: 'Archive project',
    archiveMsg: 'The project will be moved to the archive. You can restore it later.',
    restoreTitle: 'Restore project',
    restoreMsg: 'The project will be moved back to active and appear in the list again.',
    deleteTitle: 'Delete project',
    deleteMsg: 'This action cannot be undone. The project and all its tasks will be permanently deleted.',
    deleteTaskTitle: 'Delete task',
    deleteTaskMsg: 'This action cannot be undone. The task will be permanently deleted.',
  },
  lang: { switch: 'УК', current: 'EN' },

  home: {
    headlineMain: 'Project',
    headlineItalic: 'Management',
    sub: 'All projects and tasks in one place — with clear priorities and deadline control.',
    sectionTitle: 'Projects',
    addProject: 'Add project',
    newProject: 'New project',
  },

  project: {
    backTo: 'Projects',
    addTask: 'Add task',
    newTask: 'New task',
    editTask: 'Edit task',
    editProject: 'Edit project',
    viewTable: 'Table',
    viewKanban: 'Kanban',
  },

  projectForm: {
    name: 'Project name',
    namePlaceholder: 'Enter project name',
    description: 'Project description',
    descPlaceholder: 'Short description (optional)',
    cancel: 'Cancel',
    save: 'Save project',
    nameLength: 'Between 2 and 100 characters',
  },

  taskForm: {
    name: 'Task name',
    namePlaceholder: 'Enter task name',
    status: 'Status',
    statusPlaceholder: 'Select status',
    assignee: 'Assignee',
    noAssignee: 'No assignee',
    dueDate: 'Due date',
    cancel: 'Cancel',
    save: 'Save task',
    nameRequired: 'Field is required',
    nameLength: 'Between 3 and 120 characters',
    statusRequired: 'Select a status',
    dateRequired: 'Specify a date',
    datePast: 'Date cannot be in the past',
  },

  table: {
    projects: {
      search: 'Search by name...',
      allStatuses: 'All statuses',
      id: 'ID',
      name: 'Name',
      tasks: 'Tasks',
      status: 'Status',
      created: 'Created',
      empty: 'No projects found',
      deleteConfirm: 'Delete project?',
      archiveConfirm: 'Archive this project?',
      archive: 'Archive',
      restore: 'Restore',
    },
    tasks: {
      search: 'Search by assignee...',
      allStatuses: 'All statuses',
      id: 'ID',
      name: 'Name',
      assignee: 'Assignee',
      status: 'Status',
      due: 'Due date',
      empty: 'No tasks found',
    },
  },

  status: {
    active: 'Active',
    archived: 'Archived',
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  },
  statusFilter: {
    active: 'Active',
    archived: 'Archived',
  },

  kanban: {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  },

  stats: {
    projects: 'projects',
    active: 'Active',
    archived: 'Archived',
    totalTasks: 'Total tasks',
  },

  toast: {
    projectCreated: 'Project created successfully',
    projectUpdated: 'Project updated',
    projectArchived: 'Project archived',
    projectRestored: 'Project restored',
    projectDeleted: 'Project deleted',
    taskCreated: 'Task added successfully',
    taskUpdated: 'Task updated',
    taskDeleted: 'Task deleted',
  },
}
