import type {
  AchievementMatchStartResponse,
  CareerPathQuizResultDTO,
  CareerPathStartResponse,
  CareerPathSubmitRequest,
  CategoryDTO,
  GuessRequest,
  GuessResponse,
  LifelineRequest,
  LifelineResponse,
  QuizStartResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
  StartCareerPathParams,
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

export function startCareerPath(params: StartCareerPathParams): Promise<CareerPathStartResponse> {
  const query = new URLSearchParams({
    difficulty: params.difficulty,
    numberOfQuestions: String(params.numberOfQuestions),
  })

  return fetch(`${API_URL}/api/career-path/start?${query.toString()}`, {
    method: 'POST',
  }).then((res) => handleResponse<CareerPathStartResponse>(res))
}

export function submitCareerPath(payload: CareerPathSubmitRequest): Promise<CareerPathQuizResultDTO> {
  return fetch(`${API_URL}/api/career-path/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => handleResponse<CareerPathQuizResultDTO>(res))
}

export function startAchievementMatch(gridSize: number): Promise<AchievementMatchStartResponse> {
  const query = new URLSearchParams({ gridSize: String(gridSize) })

  return fetch(`${API_URL}/api/achievement-match/start?${query.toString()}`, {
    method: 'POST',
  }).then((res) => handleResponse<AchievementMatchStartResponse>(res))
}

export function guessAchievementMatch(playerId: number, achievementId: number): Promise<GuessResponse> {
  const payload: GuessRequest = { playerId, achievementId }

  return fetch(`${API_URL}/api/achievement-match/guess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => handleResponse<GuessResponse>(res))
}

export function lifelineAchievementMatch(
  playerId: number,
  boardAchievementIds: number[],
): Promise<LifelineResponse> {
  const payload: LifelineRequest = { playerId, boardAchievementIds }

  return fetch(`${API_URL}/api/achievement-match/lifeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => handleResponse<LifelineResponse>(res))
}