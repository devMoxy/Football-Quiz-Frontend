import type {
  CategoryDTO,
  QuizStartResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  StartQuizParams,
} from '../types/quiz'

const API_URL = import.meta.env.VITE_API_URL

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export function getCategories(): Promise<CategoryDTO[]> {
  return fetch(`${API_URL}/api/categories`).then((res) => handleResponse<CategoryDTO[]>(res))
}

export function startQuiz(params: StartQuizParams): Promise<QuizStartResponse> {
  const query = new URLSearchParams({
    categoryId: String(params.categoryId),
    difficulty: params.difficulty,
    numberOfQuestions: String(params.numberOfQuestions),
  })

  return fetch(`${API_URL}/api/quiz/start?${query.toString()}`, {
    method: 'POST',
  }).then((res) => handleResponse<QuizStartResponse>(res))
}

export function submitQuiz(payload: QuizSubmitRequest): Promise<QuizSubmitResponse> {
  return fetch(`${API_URL}/api/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => handleResponse<QuizSubmitResponse>(res))
}