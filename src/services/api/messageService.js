import mockMessages from '../mockData/messages.json';
import mockResponses from '../mockData/mockResponses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.messages = [];
    this.responses = mockResponses;
  }

  async getWelcomeMessage() {
    await delay(200);
    const welcomeMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'ChatBot',
      content: 'Welcome to ChatFlow! 🎉 I\'m your AI chat companion. Start a conversation by typing a message below. I can chat about anything - just try me!',
      timestamp: new Date(),
      isUser: false
    };
    return welcomeMessage;
  }

  async getMockResponse(userMessage) {
    await delay(Math.random() * 1000 + 1000); // 1-2 second delay

    const lowerMessage = userMessage.toLowerCase();
    let selectedResponse = null;

    // Find contextual response based on keywords
    for (const responseGroup of this.responses) {
      const matchingTrigger = responseGroup.triggers.find(trigger => 
        lowerMessage.includes(trigger.toLowerCase())
      );
      
      if (matchingTrigger) {
        const randomResponse = responseGroup.responses[
          Math.floor(Math.random() * responseGroup.responses.length)
        ];
        selectedResponse = randomResponse;
        break;
      }
    }

    // If no contextual response found, use a general response
    if (!selectedResponse) {
      const generalResponses = this.responses.find(group => 
        group.triggers.includes('general')
      );
      if (generalResponses) {
        selectedResponse = generalResponses.responses[
          Math.floor(Math.random() * generalResponses.responses.length)
        ];
      } else {
        selectedResponse = "That's interesting! Tell me more about that.";
      }
    }

    const responseMessage = {
      id: Date.now().toString(),
      sender: 'ChatBot',
      content: selectedResponse,
      timestamp: new Date(),
      isUser: false
    };

    return responseMessage;
  }

  async getAll() {
    await delay(300);
    return [...this.messages];
  }

  async getById(id) {
    await delay(200);
    const message = this.messages.find(m => m.id === id);
    if (!message) {
      throw new Error('Message not found');
    }
    return { ...message };
  }

  async create(messageData) {
    await delay(300);
    const newMessage = {
      id: Date.now().toString(),
      sender: messageData.sender || 'User',
      content: messageData.content,
      timestamp: new Date(),
      isUser: messageData.isUser || false,
      ...messageData
    };
    this.messages.push(newMessage);
    return { ...newMessage };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    this.messages[index] = { ...this.messages[index], ...updateData };
    return { ...this.messages[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    const deletedMessage = { ...this.messages[index] };
    this.messages.splice(index, 1);
    return deletedMessage;
  }

  async clearAll() {
    await delay(200);
    this.messages = [];
    return true;
  }
}

export const messageService = new MessageService();