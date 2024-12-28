import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  or,
} from 'firebase/firestore'
import { db } from './firebase'
import { Task, Attachment, TaskStatus } from './types'

export async function createTask(taskData: Partial<Task>) {
  const now = Timestamp.now()
  const task = {
    ...taskData,
    createdAt: now,
    updatedAt: now,
  }
  return addDoc(collection(db, 'tasks'), task)
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  const docRef = doc(db, 'tasks', taskId)
  const updates = {
    ...taskData,
    updatedAt: Timestamp.now(),
  }
  return updateDoc(docRef, updates)
}

export async function deleteTask(taskId: string) {
  const docRef = doc(db, 'tasks', taskId)
  return deleteDoc(docRef)
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const taskRef = doc(db, 'tasks', taskId)
  return updateDoc(taskRef, {
    status,
    updatedAt: Timestamp.now(),
  })
}

export async function updateTaskPriority(taskId: string, priority: Task['priority']) {
  await updateTask(taskId, { priority })
}

export async function updateTaskAssignee(taskId: string, assignee: string) {
  await updateTask(taskId, { assignee })
}

export async function addTaskAttachment(taskId: string, attachment: Attachment) {
  const taskRef = doc(db, 'tasks', taskId)
  await updateDoc(taskRef, {
    attachments: arrayUnion(attachment),
    updatedAt: serverTimestamp(),
  })
}

export function subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
  const tasksQuery = query(
    collection(db, 'tasks'),
    or(
      where('createdBy', '==', userId),
      where('assignee', '==', userId)
    )
  )

  return onSnapshot(tasksQuery, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[]
    callback(tasks)
  })
} 