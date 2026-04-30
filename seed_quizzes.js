const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://komalprajapattechnotoil_db_user:hB9V1sm2xKE1O5LC@cluster0.6htjgim.mongodb.net/test?retryWrites=true&w=majority";

// Schemas
const QuizSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, default: '' },
  }],
  difficulty: { type: String, enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED'], default: 'BASIC' },
});

const SubjectSchema = new mongoose.Schema({ name: String });
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

const quizData = [
  {
    subject: 'HTML5',
    quizzes: [
      {
        title: 'HTML Basics Quiz',
        description: 'Test your knowledge of basic HTML elements and tags.',
        difficulty: 'BASIC',
        questions: [
          {
            question: 'What does HTML stand for?',
            options: ['Hyperlinks and Text Markup Language', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyper Tool Markup Language'],
            correctAnswer: 1,
            explanation: 'HTML stands for Hyper Text Markup Language.'
          },
          {
            question: 'Which is the correct HTML element for the largest heading?',
            options: ['<heading>', '<h6>', '<h1>', '<head>'],
            correctAnswer: 2,
            explanation: '<h1> is the largest heading element.'
          }
        ]
      }
    ]
  },
  {
    subject: 'CSS3',
    quizzes: [
      {
        title: 'CSS Styling Quiz',
        description: 'Challenge your CSS layout and styling skills.',
        difficulty: 'INTERMEDIATE',
        questions: [
          {
            question: 'Which property is used to change the background color?',
            options: ['color', 'bgcolor', 'background-color', 'fill'],
            correctAnswer: 2
          },
          {
            question: 'How do you select an element with id "demo"?',
            options: ['.demo', '#demo', '*demo', 'demo'],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    subject: 'JavaScript',
    quizzes: [
      {
        title: 'JS Logic & ES6',
        description: 'Master JavaScript logic, variables, and modern features.',
        difficulty: 'BASIC',
        questions: [
          {
            question: 'Which keyword is used to declare a constant variable?',
            options: ['let', 'var', 'const', 'constant'],
            correctAnswer: 2
          },
          {
            question: 'What is the correct way to write an arrow function?',
            options: ['() => {}', 'function() => {}', '() -> {}', '=> () {}'],
            correctAnswer: 0
          }
        ]
      }
    ]
  }
];

async function seedQuizzes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Quiz.deleteMany({});

    for (const data of quizData) {
      const subject = await Subject.findOne({ name: data.subject });
      if (!subject) {
        console.log(`Subject ${data.subject} not found, skipping...`);
        continue;
      }

      for (const quizInfo of data.quizzes) {
        await Quiz.create({
          ...quizInfo,
          subjectId: subject._id
        });
        console.log(`Created Quiz: ${quizInfo.title} for ${data.subject}`);
      }
    }

    console.log('Quizzes Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedQuizzes();
