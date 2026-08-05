export interface CategoryDTO {
  id: number
  name: string
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface QuestionDTO {
  id: number
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  difficulty: Difficulty
  categoryName: string
}

export type QuizStartResponse = QuestionDTO[]

export interface StartQuizParams {
  categoryId: number
  difficulty: Difficulty
  numberOfQuestions: number
}

export interface AnswerDTO {
  questionId: number
  selectedAnswerIndex: number
}

export interface QuizSubmitRequest {
  answers: AnswerDTO[]
}

export interface QuestionResultDTO {
  questionId: number
  selectedAnswerIndex: number
  correctAnswerIndex: number
  correct: boolean
}

export interface QuizSubmitResponse {
  score: number
  totalQuestions: number
  results: QuestionResultDTO[]
}
