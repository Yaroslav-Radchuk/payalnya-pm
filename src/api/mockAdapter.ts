import MockAdapter from 'axios-mock-adapter'
import type { AxiosInstance } from 'axios'
import type { Project, Task } from '@/types'
import { ProjectStatus, TaskStatus } from '@/types'
import { readLS, writeLS } from '@/utils/storage'

const PROJECTS_KEY = 'slash_projects'
const TASKS_KEY = 'slash_tasks'
const SEED_VERSION_KEY = 'slash_seed_v'
const SEED_VERSION = '3'

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms + Math.random() * 100))

const seedProjects: Project[] = [
  {
    id: 1,
    name: 'Alpha Launch',
    description: 'Q2 product launch campaign',
    status: ProjectStatus.Active,
    createdAt: '2026-03-10T09:00:00Z',
    taskCount: 4,
  },
  {
    id: 2,
    name: 'Brand Refresh',
    description: 'Visual identity overhaul',
    status: ProjectStatus.Active,
    createdAt: '2026-04-15T12:00:00Z',
    taskCount: 3,
  },
  {
    id: 3,
    name: 'Legacy Migration',
    description: 'Move to new infrastructure',
    status: ProjectStatus.Archived,
    createdAt: '2026-01-05T08:00:00Z',
    taskCount: 2,
  },
]

const seedTasks: Task[] = [
  {
    id: 1,
    projectId: 1,
    name: 'Define scope',
    assignee: 'Olena Koval',
    status: TaskStatus.Done,
    dueDate: '2026-04-30',
    order: 0,
  },
  {
    id: 2,
    projectId: 1,
    name: 'Design system',
    assignee: 'Mykola Petrenko',
    status: TaskStatus.InProgress,
    dueDate: '2026-07-15',
    order: 1,
  },
  {
    id: 3,
    projectId: 1,
    name: 'Build API',
    assignee: null,
    status: TaskStatus.Todo,
    dueDate: '2026-08-10',
    order: 2,
  },
  {
    id: 4,
    projectId: 1,
    name: 'QA pass',
    assignee: 'Olena Koval',
    status: TaskStatus.Todo,
    dueDate: '2026-09-05',
    order: 3,
  },
  {
    id: 5,
    projectId: 2,
    name: 'Audit fonts',
    assignee: 'Daria Shevchenko',
    status: TaskStatus.Done,
    dueDate: '2026-05-20',
    order: 0,
  },
  {
    id: 6,
    projectId: 2,
    name: 'Color palette',
    assignee: null,
    status: TaskStatus.InProgress,
    dueDate: '2026-07-25',
    order: 1,
  },
  {
    id: 7,
    projectId: 2,
    name: 'Icon set',
    assignee: 'Daria Shevchenko',
    status: TaskStatus.Todo,
    dueDate: '2026-08-28',
    order: 2,
  },
  {
    id: 8,
    projectId: 3,
    name: 'Inventory services',
    assignee: 'Ivan Bondarenko',
    status: TaskStatus.Done,
    dueDate: '2026-03-10',
    order: 0,
  },
  {
    id: 9,
    projectId: 3,
    name: 'Cutover plan',
    assignee: 'Ivan Bondarenko',
    status: TaskStatus.Done,
    dueDate: '2026-03-28',
    order: 1,
  },
]

function initSeed(): void {
  if (localStorage.getItem(SEED_VERSION_KEY) !== SEED_VERSION) {
    writeLS(PROJECTS_KEY, seedProjects)
    writeLS(TASKS_KEY, seedTasks)
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION)
  }
}

function makeIdGenerator<T extends { id: number }>(key: string): () => number {
  let next = 0
  return () => {
    if (!next) {
      next = readLS<T[]>(key, []).reduce((m, x) => Math.max(m, x.id), 0) + 1
    }
    return next++
  }
}

const nextProjectId = makeIdGenerator<Project>(PROJECTS_KEY)
const nextTaskId = makeIdGenerator<Task>(TASKS_KEY)

function syncTaskCount(projects: Project[], tasks: Task[]): Project[] {
  return projects.map((p) => ({
    ...p,
    taskCount: tasks.filter((t) => t.projectId === p.id).length,
  }))
}

export function installMockAdapter(axiosInstance: AxiosInstance): void {
  initSeed()
  const mock = new MockAdapter(axiosInstance, { delayResponse: 0 })

  mock.onGet('/projects').reply(async () => {
    await delay()
    const projects = readLS<Project[]>(PROJECTS_KEY, [])
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    return [200, syncTaskCount(projects, tasks)]
  })

  mock.onPost('/projects').reply(async (config) => {
    await delay()
    const body = JSON.parse(config.data ?? '{}') as Partial<Project>
    const projects = readLS<Project[]>(PROJECTS_KEY, [])
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    const project: Project = {
      id: nextProjectId(),
      name: body.name ?? '',
      description: body.description,
      status: ProjectStatus.Active,
      createdAt: new Date().toISOString(),
      taskCount: 0,
    }
    const updated = [...projects, project]
    writeLS(PROJECTS_KEY, updated)
    return [201, syncTaskCount(updated, tasks).find((p) => p.id === project.id)]
  })

  mock.onPut(/\/projects\/\d+/).reply(async (config) => {
    await delay()
    const id = Number(config.url?.split('/').pop())
    const body = JSON.parse(config.data ?? '{}') as Partial<Project>
    const projects = readLS<Project[]>(PROJECTS_KEY, [])
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    const updated = projects.map((p) => (p.id === id ? { ...p, ...body, id } : p))
    writeLS(PROJECTS_KEY, updated)
    return [200, syncTaskCount(updated, tasks).find((p) => p.id === id)]
  })

  mock.onDelete(/\/projects\/\d+/).reply(async (config) => {
    await delay()
    const id = Number(config.url?.split('/').pop())
    const projects = readLS<Project[]>(PROJECTS_KEY, [])
    writeLS(PROJECTS_KEY, projects.filter((p) => p.id !== id))
    return [204, null]
  })

  mock.onGet('/tasks').reply(async (config) => {
    await delay()
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    const projectId = config.params?.projectId ? Number(config.params.projectId) : null
    return [200, projectId ? tasks.filter((t) => t.projectId === projectId) : tasks]
  })

  mock.onPost('/tasks').reply(async (config) => {
    await delay()
    const body = JSON.parse(config.data ?? '{}') as Partial<Task>
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    const projectTasks = tasks.filter((t) => t.projectId === body.projectId)
    const task: Task = {
      id: nextTaskId(),
      projectId: body.projectId ?? 0,
      name: body.name ?? '',
      assignee: body.assignee ?? null,
      status: body.status ?? TaskStatus.Todo,
      dueDate: body.dueDate ?? '',
      order: projectTasks.length,
    }
    writeLS(TASKS_KEY, [...tasks, task])
    return [201, task]
  })

  mock.onPut(/\/tasks\/\d+/).reply(async (config) => {
    await delay()
    const id = Number(config.url?.split('/').pop())
    const body = JSON.parse(config.data ?? '{}') as Partial<Task>
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...body, id } : t))
    writeLS(TASKS_KEY, updated)
    return [200, updated.find((t) => t.id === id)]
  })

  mock.onDelete(/\/tasks\/\d+/).reply(async (config) => {
    await delay()
    const id = Number(config.url?.split('/').pop())
    const tasks = readLS<Task[]>(TASKS_KEY, [])
    writeLS(TASKS_KEY, tasks.filter((t) => t.id !== id))
    return [204, null]
  })
}
