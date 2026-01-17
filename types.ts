
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  groundingChunks?: any[];
  timestamp: Date;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
