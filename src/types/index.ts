export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ApiResponse {
  message: string;
  success: boolean;
  data?: any;
}
