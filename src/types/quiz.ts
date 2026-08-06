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

export interface ClubStintDTO {
  clubName: string
  logoUrl: string
  clubOrder: number
}

export interface CareerPathQuestionDTO {
  id: number
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  difficulty: Difficulty
  clubStints: ClubStintDTO[]
}

export type CareerPathStartResponse = CareerPathQuestionDTO[]

export interface StartCareerPathParams {
  difficulty: Difficulty
  numberOfQuestions: number
}

export interface CareerPathAnswerDTO {
  questionId: number
  selectedAnswerIndex: number
}

export interface CareerPathSubmitRequest {
  answers: CareerPathAnswerDTO[]
}

export interface CareerPathResultDTO {
  questionId: number
  selectedAnswerIndex: number
  correctAnswerIndex: number
  correctPlayerName: string
  correct: boolean
}

export interface CareerPathQuizResultDTO {
  score: number
  totalQuestions: number
  results: CareerPathResultDTO[]
}
