import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.dispatch = null;
  }

  connect(dispatch) {
    this.dispatch = dispatch;
    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket || !this.dispatch) return;

    // Import Redux actions dynamically to avoid circular dependencies
    const { setConnected, setStudents, addStudent, removeStudent, setKicked, setError } = require('../store/slices/userSlice');
    const { setPoll, setResults, setHasAnswered, setCanCreatePoll, setTimeRemaining, setPollHistory, addToPollHistory } = require('../store/slices/pollSlice');
    const { addMessage, setMessages } = require('../store/slices/chatSlice');

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.dispatch(setConnected(true));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.dispatch(setConnected(false));
    });

    // Poll events
    this.socket.on('current-poll', (data) => {
      if (data.poll) {
        this.dispatch(setPoll(data.poll));
        this.dispatch(setResults(data.results));
        this.startTimer(data.poll.timeLimit);
      }
    });

    this.socket.on('new-poll', (poll) => {
      this.dispatch(setPoll(poll));
      this.dispatch(setHasAnswered(false));
      this.dispatch(setCanCreatePoll(false));
      this.startTimer(poll.timeLimit);
    });

    this.socket.on('poll-results-update', (results) => {
      this.dispatch(setResults(results));
    });

    this.socket.on('poll-ended', (data) => {
      this.dispatch(setPoll(data.poll));
      this.dispatch(setResults(data.results));
      this.dispatch(setCanCreatePoll(true));
      this.dispatch(setTimeRemaining(0));
      this.dispatch(addToPollHistory(data.poll));
    });

    this.socket.on('answer-submitted', (data) => {
      this.dispatch(setHasAnswered(true));
      this.dispatch(setResults(data.results));
    });

    this.socket.on('answer-error', (error) => {
      this.dispatch(setError(error));
    });

    // Student management events
    this.socket.on('students-list', (students) => {
      this.dispatch(setStudents(students));
    });

    this.socket.on('student-joined', (student) => {
      this.dispatch(addStudent(student));
    });

    this.socket.on('student-left', (student) => {
      this.dispatch(removeStudent(student));
    });

    this.socket.on('kicked-out', (message) => {
      this.dispatch(setKicked(true));
      this.dispatch(setError(message));
    });

    this.socket.on('join-error', (error) => {
      this.dispatch(setError(error));
    });

    // Chat events
    this.socket.on('chat-messages', (messages) => {
      this.dispatch(setMessages(messages));
    });

    this.socket.on('new-chat-message', (message) => {
      this.dispatch(addMessage(message));
    });

    this.socket.on('chat-error', (error) => {
      this.dispatch(setError(error));
    });
  }

  // Teacher methods
  joinAsTeacher() {
    if (this.socket) {
      this.socket.emit('join-as-teacher');
    }
  }

  createPoll(pollData) {
    if (this.socket) {
      this.socket.emit('create-poll', pollData);
    }
  }

  kickStudent(studentId) {
    if (this.socket) {
      this.socket.emit('kick-student', studentId);
    }
  }

  // Student methods
  joinAsStudent(name) {
    if (this.socket) {
      this.socket.emit('join-as-student', name);
    }
  }

  submitAnswer(answer) {
    if (this.socket) {
      this.socket.emit('submit-answer', answer);
      this.dispatch(require('../store/slices/pollSlice').setHasAnswered(true));
    }
  }

  // Chat methods
  sendChatMessage(message, name, role) {
    if (this.socket) {
      this.socket.emit('send-chat-message', {
        message,
        name,
        role
      });
    }
  }

  // Timer management
  startTimer(duration) {
    if (!this.dispatch) return;
    
    const { setTimeRemaining } = require('../store/slices/pollSlice');
    this.dispatch(setTimeRemaining(duration));
    
    let timeLeft = duration;
    const timer = setInterval(() => {
      timeLeft--;
      this.dispatch(setTimeRemaining(timeLeft));
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();