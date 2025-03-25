export interface Member{
  "id": string,
  "name": string,
  "phone_number": string,
  "email": string,
  "status": "current" | "previous",
  "last_allot_id": string | null,
  "created_on": string,
  "lastAllotment": {
      "id": string,
      "member_id": string,
      "seat_num": number,
      "start_date": string,
      "end_date": string,
      "full_day": boolean,
      "first_half": boolean,
      "second_half": boolean
  }
}

export interface Allotment {
  "id"?: string,
  "member_id": string,
  "seat_num": number,
  "start_date": string,
  "end_date": string,
  "full_day": boolean,
  "first_half": boolean,
  "second_half": boolean
}