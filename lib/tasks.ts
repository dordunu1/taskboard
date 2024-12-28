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
import { Task, Attachment } from './types'

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Timestamp.now()
  await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const taskRef = doc(db, 'tasks', taskId)
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, 'tasks', taskId)
  await deleteDoc(taskRef)
}

export async function updateTaskStatus(taskId: string, status: Task['status']) {
  const taskRef = doc(db, 'tasks', taskId)
  await updateDoc(taskRef, {
    status,
    updatedAt: serverTimestamp(),
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
  const q = query(
    collection(db, 'tasks'),
    or(
      where('createdBy', '==', userId),
      where('assignee', '==', userId)
    ),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[]
    callback(tasks)
  })
} 