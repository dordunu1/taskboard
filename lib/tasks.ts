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
  getDocs,
} from 'firebase/firestore'
import { db } from './firebase'
import { Task, Comment } from './types'

const tasksCollection = collection(db, 'tasks')
const commentsCollection = collection(db, 'comments')

export async function createTask(taskData: Partial<Task>) {
  const now = Timestamp.now()
  const task = {
    ...taskData,
    createdAt: now,
    updatedAt: now,
  }
  return addDoc(tasksCollection, task)
}

export async function updateTask(taskId: string, taskData: Partial<Task>) {
  const docRef = doc(tasksCollection, taskId)
  const updates = {
    ...taskData,
    updatedAt: Timestamp.now(),
  }
  return updateDoc(docRef, updates)
}

export async function deleteTask(taskId: string) {
  const docRef = doc(tasksCollection, taskId)
  return deleteDoc(docRef)
}

export function subscribeToTasks(userId: string, callback: (tasks: Task[]) => void) {
  const q = query(
    tasksCollection,
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[]
    callback(tasks)
  })
}

interface NewComment {
  text: string
  userName: string
  createdAt: Timestamp
}

export async function addComment(taskId: string, comment: NewComment) {
  return addDoc(commentsCollection, {
    ...comment,
    taskId,
  })
}

export async function getComments(taskId: string): Promise<Comment[]> {
  const q = query(
    commentsCollection,
    where('taskId', '==', taskId),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[]
} 