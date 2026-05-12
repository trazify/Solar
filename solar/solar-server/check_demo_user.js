import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/users/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const user = await User.findOne({ email: 'dealer@solarkits.com' });
    if (user) {
      console.log('User exists:', user.email, 'Role:', user.role);
      
      const match1 = await user.matchPassword('123456');
      console.log('Password match for 123456:', match1);
      
      const match2 = await user.matchPassword('password123');
      console.log('Password match for password123:', match2);

      const match3 = await user.matchPassword('password');
      console.log('Password match for password:', match3);

    } else {
      console.log('User dealer@solarkits.com NOT FOUND');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
