export interface VerifyIdFrontApiResponse {
  services: Services
  data: Data
  error_code: number
  error_message: string
}

export interface Services {
  Validations: Validations
  spoofing: Spoofing
  classification: Classification
  liveness: boolean
  AML: Aml
  SRC: Src
}

export interface Validations {
  validation_errors: ValidationError[]
}

export interface ValidationError {
  field: string
  value: string
  errors: Error[]
}

export interface Error {
  code: number
  message: string
}

export interface Spoofing {
  fake: boolean
}

export interface Classification {
  doc_type: string
}

export interface Aml {
  AML_matched: boolean
  data: Daum[]
}

export interface Daum {
  caseNo: string
  caseYear: number
  recordDate: string
  fullName: string
  idNumber: string
  dateOfBirth: string
  score: string
}

export interface Src {
  isValid: boolean
  errorCode: number
  errorKey: string
  errorMessage: string
}

export interface Data {
  isVerificationProcessCompleted: boolean
  isDigitalIdentityVerified: boolean
  deviceInfo: string
  user: User
  idFrontData: IdFrontData
  idBackData: IdBackData
}

export interface User {
  id: number
  name: string
  surname: string
  fullName: string
  userName: string
  emailAddress: string
  phoneNumber: string
  idNumber: string
  address: string
}

export interface IdFrontData {
  name_english: string
  first_name_english: string
  last_names_english: string
  name: string
  address: string
  dateOfBirth: string
  idNumber: string
  gender: string
}

export interface IdBackData {
  maritalStatus: string
  job: string
  jobTitle: string
  religion: string
  husbandName: string
  releaseDate: string
  idExpiry: string
  idNumber: string
  gender: string
}
