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

export async function createTask(taskData: Partial<Task>) {
  const tasksRef = collection(db, 'tasks')
  const now = Timestamp.now()
  
  const task = {
    ...taskData,
    createdAt: now,
    updatedAt: now,
  }

  return addDoc(tasksRef, task)
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  const taskRef = doc(db, 'tasks', taskId)
  const now = Timestamp.now()
  
  const updates = {
    ...taskData,
    updatedAt: now,
  }

  return updateDoc(taskRef, updates)
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, 'tasks', taskId)
  await deleteDoc(taskRef)
}

export async function updateTaskStatus(taskId: string, status: string) {
  const taskRef = doc(db, 'tasks', taskId)
  return updateDoc(taskRef, { 
    status,
    updatedAt: Timestamp.now()
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
  const tasksRef = collection(db, 'tasks')
  const q = query(
    tasksRef,
    or(
      where('createdBy', '==', userId),
      where('assignee', '==', userId)
    )
  )

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[]
    callback(tasks)
  })
} 