export interface IChat {
    id: string;
    displayName: string;
    email: string;
    userType: 'human' | 'joined';
    messageType: 'text' | 'card' | 'quickReplies' | 'carousel';
    message: string;
    createdAt: string;
    isMe: boolean;
  }
