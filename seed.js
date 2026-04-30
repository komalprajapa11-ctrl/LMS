const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://komalprajapattechnotoil_db_user:hB9V1sm2xKE1O5LC@cluster0.6htjgim.mongodb.net/test?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing demo users if any
    await User.deleteMany({ email: { $in: ['admin@technotoil.com', 'user@technotoil.com'] } });

    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    await User.create([
      {
        name: 'Admin User',
        email: 'admin@technotoil.com',
        password: adminPassword,
        role: 'ADMIN'
      },
      {
        name: 'Regular User',
        email: 'user@technotoil.com',
        password: userPassword,
        role: 'USER'
      }
    ]);

    console.log('Seed successful: Demo accounts created.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
