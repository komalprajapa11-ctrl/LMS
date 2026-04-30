const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://komalprajapattechnotoil_db_user:hB9V1sm2xKE1O5LC@cluster0.6htjgim.mongodb.net/test?retryWrites=true&w=majority";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

const SectionSchema = new mongoose.Schema({
  type: { type: String, enum: ['HEADING', 'TEXT', 'BULLETS', 'CODE', 'NOTE'], required: true },
  content: { type: String, required: true },
  language: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const TopicSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  sections: [SectionSchema],
}, { timestamps: true });

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);

const webDevData = [
  {
    subject: { name: 'HTML5', description: 'The backbone of every website. Master semantics, forms, and modern web structures.' },
    topics: [
      {
        title: 'HTML Introduction',
        sections: [
          { type: 'HEADING', content: 'What is HTML?' },
          { type: 'TEXT', content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.' },
          { type: 'CODE', content: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>', language: 'html' }
        ]
      },
      {
        title: 'HTML Basics',
        subTopics: [
          { title: 'HTML Elements', sections: [{ type: 'TEXT', content: 'An HTML element is defined by a start tag, some content, and an end tag.' }, { type: 'CODE', content: '<p>This is a paragraph.</p>', language: 'html' }] },
          { title: 'HTML Attributes', sections: [{ type: 'TEXT', content: 'Attributes provide additional information about HTML elements.' }, { type: 'CODE', content: '<a href="https://google.com">Click Me</a>', language: 'html' }] }
        ]
      },
      {
        title: 'HTML Semantics',
        sections: [
          { type: 'HEADING', content: 'Why Semantics Matter' },
          { type: 'TEXT', content: 'Semantic elements clearly describe their meaning to both the browser and the developer.' },
          { type: 'BULLETS', content: '<header>\n<nav>\n<main>\n<article>\n<section>\n<footer>' }
        ]
      }
    ]
  },
  {
    subject: { name: 'CSS3', description: 'Transform plain HTML into stunning visual experiences with modern layout engines and animations.' },
    topics: [
      {
        title: 'CSS Introduction',
        sections: [
          { type: 'HEADING', content: 'Styling the Web' },
          { type: 'TEXT', content: 'CSS (Cascading Style Sheets) is used to style and layout web pages.' },
          { type: 'CODE', content: 'body {\n  background-color: #f0f2f5;\n  font-family: sans-serif;\n}', language: 'css' }
        ]
      },
      {
        title: 'CSS Selectors',
        sections: [
          { type: 'TEXT', content: 'Selectors are used to target HTML elements.' },
          { type: 'CODE', content: '/* Element Selector */\np { color: blue; }\n\n/* Class Selector */\n.btn { padding: 10px; }\n\n/* ID Selector */\n#main { margin: 20px; }', language: 'css' }
        ]
      },
      {
        title: 'Advanced Layouts',
        subTopics: [
          { title: 'Flexbox Guide', sections: [{ type: 'TEXT', content: 'Flexbox makes it easy to align items in a row or column.' }, { type: 'CODE', content: '.flex-container {\n  display: flex;\n  justify-content: space-around;\n}', language: 'css' }] },
          { title: 'Grid System', sections: [{ type: 'TEXT', content: 'CSS Grid is a 2D layout system for the web.' }, { type: 'CODE', content: '.grid-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n}', language: 'css' }] }
        ]
      }
    ]
  },
  {
    subject: { name: 'JavaScript', description: 'The brain of the web. Learn core logic, asynchronous programming, and modern ES6+ features.' },
    topics: [
      {
        title: 'JS Basics',
        sections: [
          { type: 'HEADING', content: 'Variables & Data Types' },
          { type: 'CODE', content: 'let name = "Technotoil";\nconst version = 1.0;\nlet isReady = true;', language: 'javascript' }
        ]
      },
      {
        title: 'Modern JS (ES6+)',
        subTopics: [
          { title: 'Arrow Functions', sections: [{ type: 'TEXT', content: 'Shorter syntax for writing functions.' }, { type: 'CODE', content: 'const add = (a, b) => a + b;', language: 'javascript' }] },
          { title: 'Destructuring', sections: [{ type: 'TEXT', content: 'Extract data from arrays or objects easily.' }, { type: 'CODE', content: 'const { name, age } = user;', language: 'javascript' }] }
        ]
      },
      {
        title: 'Async JavaScript',
        sections: [
          { type: 'HEADING', content: 'Promises and Async/Await' },
          { type: 'CODE', content: 'async function getData() {\n  const res = await fetch(url);\n  const data = await res.json();\n}', language: 'javascript' }
        ]
      }
    ]
  },
  {
    subject: { name: 'React', description: 'Build component-based, high-performance user interfaces with the industry-standard library.' },
    topics: [
      {
        title: 'React Fundamentals',
        sections: [
          { type: 'HEADING', content: 'Components & Props' },
          { type: 'TEXT', content: 'React apps are built using components.' },
          { type: 'CODE', content: 'function MyComponent({ title }) {\n  return <h1>{title}</h1>;\n}', language: 'jsx' }
        ]
      },
      {
        title: 'React Hooks',
        subTopics: [
          { title: 'useState Hook', sections: [{ type: 'TEXT', content: 'Manage local state in functional components.' }, { type: 'CODE', content: 'const [count, setCount] = useState(0);', language: 'jsx' }] },
          { title: 'useEffect Hook', sections: [{ type: 'TEXT', content: 'Handle side effects like data fetching.' }, { type: 'CODE', content: 'useEffect(() => { fetchData(); }, []);', language: 'jsx' }] }
        ]
      }
    ]
  },
  {
    subject: { name: 'Node.js', description: 'Power your backend with JavaScript. Learn server-side logic, file systems, and scalability.' },
    topics: [
      {
        title: 'Node Overview',
        sections: [
          { type: 'HEADING', content: 'What is Node.js?' },
          { type: 'TEXT', content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine.' }
        ]
      },
      {
        title: 'Built-in Modules',
        subTopics: [
          { title: 'File System (FS)', sections: [{ type: 'CODE', content: 'const fs = require("fs");\nfs.readFile("file.txt", "utf8", (err, data) => { ... });', language: 'javascript' }] },
          { title: 'HTTP Module', sections: [{ type: 'CODE', content: 'const http = require("http");\nhttp.createServer((req, res) => { ... }).listen(8080);', language: 'javascript' }] }
        ]
      }
    ]
  },
  {
    subject: { name: 'Express', description: 'The industry standard for building robust APIs and web applications with Node.js.' },
    topics: [
      {
        title: 'Express Basics',
        sections: [
          { type: 'HEADING', content: 'Setting up Express' },
          { type: 'CODE', content: 'const express = require("express");\nconst app = express();\napp.listen(3000);', language: 'javascript' }
        ]
      },
      {
        title: 'Routing & Controllers',
        subTopics: [
          { title: 'HTTP Methods', sections: [{ type: 'TEXT', content: 'GET, POST, PUT, DELETE requests.' }, { type: 'CODE', content: 'app.get("/users", (req, res) => { ... });', language: 'javascript' }] },
          { title: 'Middleware', sections: [{ type: 'TEXT', content: 'Functions that run before the final handler.' }, { type: 'CODE', content: 'app.use(express.json());', language: 'javascript' }] }
        ]
      }
    ]
  },
  {
    subject: { name: 'MongoDB', description: 'Master NoSQL databases. Store JSON-like documents and scale with ease.' },
    topics: [
      {
        title: 'NoSQL Concepts',
        sections: [
          { type: 'HEADING', content: 'Collections & Documents' },
          { type: 'TEXT', content: 'MongoDB stores data as BSON documents inside collections.' }
        ]
      },
      {
        title: 'Mongoose ODM',
        subTopics: [
          { title: 'Defining Schemas', sections: [{ type: 'CODE', content: 'const userSchema = new mongoose.Schema({ name: String });', language: 'javascript' }] },
          { title: 'CRUD Operations', sections: [{ type: 'CODE', content: 'await User.create({ name: "John" });', language: 'javascript' }] }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Subject.deleteMany({});
    await Topic.deleteMany({});

    for (const data of webDevData) {
      const subject = await Subject.create(data.subject);
      console.log(`- Subject: ${subject.name}`);

      for (let i = 0; i < data.topics.length; i++) {
        const topicData = data.topics[i];
        const parent = await Topic.create({
          subjectId: subject._id,
          title: topicData.title,
          sections: topicData.sections || [],
          order: i
        });

        if (topicData.subTopics) {
          for (let j = 0; j < topicData.subTopics.length; j++) {
            const subData = topicData.subTopics[j];
            await Topic.create({
              subjectId: subject._id,
              parentId: parent._id,
              title: subData.title,
              sections: subData.sections || [],
              order: j
            });
          }
        }
      }
    }

    console.log('Seeding Success!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
}

seed();
