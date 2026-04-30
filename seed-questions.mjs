import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);

const SubjectSchema = new mongoose.Schema({ name: String }, { strict: false });
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);

const InterviewQuestionSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  topicId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  question:  { type: String, required: true, trim: true },
  answer:    { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED'], default: 'BASIC' },
  category: { type: String, enum: ['Conceptual', 'Coding', 'Behavioral', 'System Design', 'Other'], default: 'Conceptual' },
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

const InterviewQuestion = mongoose.models.InterviewQuestion || mongoose.model('InterviewQuestion', InterviewQuestionSchema);

function generateQuestionsForSubject(subjectName, subjectId) {
  const name = subjectName.toLowerCase();
  
  if (name.includes('react')) {
    return [
      { subjectId, question: "What is the Virtual DOM and how does it work?", answer: "The Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to diff changes and selectively update the real DOM.", difficulty: "BASIC", category: "Conceptual", tags: ["virtual-dom", "react"] },
      { subjectId, question: "Explain the difference between useEffect and useLayoutEffect.", answer: "useEffect runs asynchronously after paint, useLayoutEffect runs synchronously before paint.", difficulty: "INTERMEDIATE", category: "Conceptual", tags: ["hooks", "lifecycle"] },
      { subjectId, question: "What is Prop Drilling and how can you avoid it?", answer: "Prop drilling is passing data through many nested layers of components. It can be avoided using Context API, Redux, or component composition.", difficulty: "BASIC", category: "Conceptual", tags: ["state", "props"] },
      { subjectId, question: "How does React handle state batching in React 18?", answer: "React 18 batches multiple state updates inside promises and timeouts automatically to minimize re-renders.", difficulty: "ADVANCED", category: "Conceptual", tags: ["react 18", "performance"] },
      { subjectId, question: "What is the useMemo hook used for?", answer: "useMemo caches the result of an expensive calculation between re-renders to improve performance.", difficulty: "INTERMEDIATE", category: "Coding", tags: ["hooks", "performance"] },
    ];
  }

  if (name.includes('node') || name.includes('backend')) {
    return [
      { subjectId, question: "What is the Event Loop in Node.js?", answer: "The Event Loop allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.", difficulty: "INTERMEDIATE", category: "System Design", tags: ["event-loop", "architecture"] },
      { subjectId, question: "Explain the difference between process.nextTick() and setImmediate().", answer: "process.nextTick() fires immediately on the same phase, whereas setImmediate() fires on the following iteration or 'tick' of the event loop.", difficulty: "ADVANCED", category: "Conceptual", tags: ["event-loop", "timers"] },
      { subjectId, question: "What are Streams in Node.js?", answer: "Streams are collections of data that might not be available all at once and don't have to fit in memory. They are used for handling large files.", difficulty: "INTERMEDIATE", category: "Conceptual", tags: ["streams", "memory"] },
      { subjectId, question: "How do you handle errors in asynchronous middleware in Express?", answer: "By passing the error to the next() function: next(err), which will then be caught by the global error handling middleware.", difficulty: "BASIC", category: "Coding", tags: ["express", "error-handling"] },
      { subjectId, question: "What is JWT and how does it work?", answer: "JSON Web Token is an open standard for securely transmitting information. It contains a header, payload, and a signature to verify its authenticity.", difficulty: "BASIC", category: "System Design", tags: ["auth", "security"] },
    ];
  }

  if (name.includes('javascript') || name.includes('js')) {
    return [
      { subjectId, question: "Explain the difference between let, const, and var.", answer: "var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned.", difficulty: "BASIC", category: "Conceptual", tags: ["es6", "variables"] },
      { subjectId, question: "What are closures?", answer: "A closure is a function that remembers its outer variables and can access them.", difficulty: "INTERMEDIATE", category: "Conceptual", tags: ["functions", "scope"] },
      { subjectId, question: "What is the difference between == and ===?", answer: "== compares values with type coercion, === compares both value and type without coercion.", difficulty: "BASIC", category: "Conceptual", tags: ["types", "operators"] },
      { subjectId, question: "Explain Event Bubbling and Event Capturing.", answer: "Event bubbling propagates from the target element up to the root. Capturing propagates from the root down to the target element.", difficulty: "INTERMEDIATE", category: "Conceptual", tags: ["dom", "events"] },
      { subjectId, question: "What is the difference between Call, Apply and Bind?", answer: "Call and Apply invoke a function immediately with a specified `this` context (Apply takes an array of arguments). Bind returns a new function with the bound context.", difficulty: "ADVANCED", category: "Conceptual", tags: ["functions", "this"] },
    ];
  }

  if (name.includes('python')) {
    return [
      { subjectId, question: "What are the key differences between Python 2 and 3?", answer: "Print is a function in Python 3. Integer division yields a float in Python 3. Unicode is the default string type in Python 3.", difficulty: "BASIC", category: "Conceptual", tags: ["python", "versions"] },
      { subjectId, question: "What are Python decorators?", answer: "Decorators are a way to modify or enhance the behavior of functions or methods without permanently modifying their code.", difficulty: "INTERMEDIATE", category: "Conceptual", tags: ["functions", "decorators"] },
      { subjectId, question: "Explain the GIL (Global Interpreter Lock).", answer: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once in CPython.", difficulty: "ADVANCED", category: "System Design", tags: ["concurrency", "performance"] },
      { subjectId, question: "What is a lambda function in Python?", answer: "A lambda function is a small anonymous function defined with the lambda keyword, usually containing a single expression.", difficulty: "BASIC", category: "Coding", tags: ["functions", "lambda"] },
      { subjectId, question: "Difference between list and tuple?", answer: "Lists are mutable (can be changed), while tuples are immutable (cannot be changed after creation).", difficulty: "BASIC", category: "Conceptual", tags: ["data-structures"] },
    ];
  }

  // Generic fallback for any other subject
  return [
    { subjectId, question: `What are the core concepts of ${subjectName}?`, answer: `The core concepts generally revolve around best practices, architecture, and syntax specific to ${subjectName}.`, difficulty: "BASIC", category: "Conceptual", tags: ["basics"] },
    { subjectId, question: `How do you optimize performance in ${subjectName}?`, answer: "Performance optimization involves minimizing resource usage, caching, and writing efficient algorithms.", difficulty: "INTERMEDIATE", category: "System Design", tags: ["performance"] },
    { subjectId, question: `What are common design patterns used in ${subjectName}?`, answer: "Common patterns include Singleton, Observer, and Factory, depending on the paradigm used.", difficulty: "ADVANCED", category: "Conceptual", tags: ["design-patterns"] },
    { subjectId, question: `How do you handle errors and debugging in ${subjectName}?`, answer: "Using try-catch blocks, proper logging mechanisms, and step-through debuggers.", difficulty: "BASIC", category: "Coding", tags: ["debugging", "errors"] },
    { subjectId, question: `Explain testing strategies for ${subjectName}.`, answer: "A mix of Unit testing, Integration testing, and End-to-End testing is highly recommended.", difficulty: "INTERMEDIATE", category: "Conceptual", tags: ["testing", "qa"] },
  ];
}

async function seed() {
  try {
    const subjects = await Subject.find();
    if (subjects.length === 0) {
      console.log("No subjects found in the database. Please add a subject first.");
      process.exit(1);
    }
    
    // Clear old questions
    await InterviewQuestion.deleteMany({});
    
    let allQuestions = [];
    
    for (const subject of subjects) {
      const q = generateQuestionsForSubject(subject.name, subject._id);
      allQuestions = allQuestions.concat(q);
      console.log(`Generated 5 questions for: ${subject.name}`);
    }
    
    await InterviewQuestion.insertMany(allQuestions);
    console.log(`\n✅ Successfully seeded a total of ${allQuestions.length} interview questions across ${subjects.length} subjects.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
}

seed();
