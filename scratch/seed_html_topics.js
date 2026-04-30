const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://komalprajapattechnotoil_db_user:hB9V1sm2xKE1O5LC@cluster0.6htjgim.mongodb.net/test?retryWrites=true&w=majority';

const SectionSchema = new mongoose.Schema({
  type: { type: String, enum: ['HEADING', 'TEXT', 'BULLETS', 'CODE', 'NOTE'], required: true },
  content: { type: String, required: true },
  language: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const TopicSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  sections: [SectionSchema],
}, { timestamps: true });

const SubjectSchema = new mongoose.Schema({ name: String });

const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const htmlSubject = await Subject.findOne({ name: /html/i });
    if (!htmlSubject) {
      console.error('HTML Subject not found! Please create it in the UI first.');
      process.exit(1);
    }

    console.log(`Found Subject: ${htmlSubject.name} (${htmlSubject._id})`);

    // Clear existing topics for HTML
    await Topic.deleteMany({ subjectId: htmlSubject._id });
    console.log('Cleared existing topics');

    const topics = [
      {
        title: 'HTML Introduction',
        order: 1,
        sections: [
          { type: 'HEADING', content: 'What is HTML?', order: 0 },
          { type: 'TEXT', content: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating Web pages.', order: 1 },
          { type: 'CODE', content: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>\n\n</body>\n</html>', language: 'html', order: 2 },
          { type: 'NOTE', content: 'HTML describes the structure of a Web page semantically.', order: 3 }
        ]
      },
      {
        title: 'HTML Elements',
        order: 2,
        sections: [
          { type: 'HEADING', content: 'HTML Element Syntax', order: 0 },
          { type: 'TEXT', content: 'An HTML element is defined by a start tag, some content, and an end tag:', order: 1 },
          { type: 'CODE', content: '<tagname> Content goes here... </tagname>', language: 'html', order: 2 },
          { type: 'BULLETS', content: 'The HTML element is everything from the start tag to the end tag.\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>', order: 3 }
        ]
      },
      {
        title: 'HTML Attributes',
        order: 3,
        sections: [
          { type: 'HEADING', content: 'The href Attribute', order: 0 },
          { type: 'TEXT', content: 'The <a> tag defines a hyperlink. The href attribute specifies the URL of the page the link goes to:', order: 1 },
          { type: 'CODE', content: '<a href="https://www.w3schools.com">Visit W3Schools</a>', language: 'html', order: 2 },
          { type: 'NOTE', content: 'Attributes provide additional information about elements.', order: 3 }
        ]
      },
      {
        title: 'HTML Headings',
        order: 4,
        sections: [
          { type: 'HEADING', content: 'HTML Headings', order: 0 },
          { type: 'TEXT', content: 'HTML headings are defined with the <h1> to <h6> tags.', order: 1 },
          { type: 'CODE', content: '<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>\n<h4>Heading 4</h4>\n<h5>Heading 5</h5>\n<h6>Heading 6</h6>', language: 'html', order: 2 }
        ]
      },
      {
        title: 'HTML Paragraphs',
        order: 5,
        sections: [
          { type: 'HEADING', content: 'HTML Paragraphs', order: 0 },
          { type: 'TEXT', content: 'The HTML <p> element defines a paragraph.', order: 1 },
          { type: 'CODE', content: '<p>This is a paragraph.</p>\n<p>This is another paragraph.</p>', language: 'html', order: 2 }
        ]
      }
    ];

    for (const t of topics) {
      await Topic.create({ ...t, subjectId: htmlSubject._id });
      console.log(`Added topic: ${t.title}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
