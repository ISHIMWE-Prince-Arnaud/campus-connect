/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import { connectDb } from '../server/utils/db.js';
import User from '../server/models/User.js';
import Post from '../server/models/Post.js';
import Chat from '../server/models/Chat.js';
import Message from '../server/models/Message.js';
import Quest from '../server/models/Quest.js';

async function main() {
  await connectDb();
  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Chat.deleteMany({}), Message.deleteMany({}), Quest.deleteMany({})]);

  const genders = ['male','female','other'];
  const users = [];
  for (let i = 0; i < 12; i++) {
    const username = `user${i+1}`;
    users.push({
      username,
      displayName: `User ${i+1}`,
      email: `${username}@example.com`,
      passwordHash: await bcrypt.hash('password', 10),
      gender: genders[i % 3],
      roles: ['student'],
      points: Math.floor(Math.random() * 50)
    });
  }
  const admin = {
    username: 'admin',
    displayName: 'Admin',
    email: 'admin@example.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    gender: 'other',
    roles: ['student','admin'],
    points: 100
  };
  const createdUsers = await User.insertMany([...users, admin]);

  const posts = [];
  for (let i = 0; i < 10; i++) {
    const author = createdUsers[i % createdUsers.length];
    posts.push({
      author: author._id,
      content: `Demo post ${i+1} by @${author.username} - Hello Campus!`,
      mediaUrl: '',
      mentions: []
    });
  }
  await Post.insertMany(posts);

  // Create 5 pairs and chats with messages, active quest
  const pairs = [];
  for (let i = 0; i < 10; i += 2) {
    pairs.push([createdUsers[i], createdUsers[i+1]]);
  }
  const chats = [];
  for (const pair of pairs.slice(0, 5)) {
    const chat = await Chat.create({
      type: 'pair',
      participants: pair.map(u => u._id),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });
    chats.push(chat);
    await Message.create({
      chat: chat._id,
      sender: pair[0]._id,
      text: 'Hey! Ready for the quest?',
      mediaUrl: ''
    });
    await Message.create({
      chat: chat._id,
      sender: pair[1]._id,
      text: 'Yes! Let’s create a meme!',
      mediaUrl: ''
    });
  }

  const quest = await Quest.create({
    type: 'mysteryPair',
    participants: pairs.flat().map(u => u._id),
    prompt: 'Co-create a meme about coding!',
    status: 'assigned',
    assignedAt: new Date(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    chatId: chats[0]?._id,
    submissions: []
  });

  console.log('Seed complete:', {
    users: createdUsers.length,
    posts: posts.length,
    chats: chats.length,
    quest: String(quest._id)
  });
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });



