import Chat from '../models/Chat.js';
import Quest from '../models/Quest.js';
import { awardPointsToUsers, POINTS } from './pointsService.js';

export async function assignMysteryPairs(prompt, pairs, expiresAt, io) {
  const createdQuests = [];
  for (const pair of pairs) {
    const chat = await Chat.create({
      type: 'pair',
      participants: pair.map(u => u._id),
      expiresAt
    });
    const quest = await Quest.create({
      type: 'mysteryPair',
      participants: pair.map(u => u._id),
      prompt,
      status: 'assigned',
      assignedAt: new Date(),
      expiresAt,
      chatId: chat._id,
      submissions: []
    });
    createdQuests.push(quest);
    pair.forEach(u => {
      io.to(String(u._id)).emit('quest:assigned', { questId: String(quest._id) });
    });
  }
  return createdQuests;
}

export async function submitQuest(questId, userId, content, mediaUrl) {
  const quest = await Quest.findById(questId);
  if (!quest) throw new Error('Quest not found');
  if (quest.status !== 'assigned' && quest.status !== 'submitted') throw new Error('Submissions closed');
  if (!quest.participants.map(String).includes(String(userId))) throw new Error('Not a participant');

  const team = quest.type === 'mysteryPair' ? quest.participants : [userId]; // simplified
  if (!quest.submissions.find(s => s.team.some(id => String(id) === String(userId)))) {
    quest.submissions.push({ team, content, mediaUrl, votes: [] });
    quest.status = 'submitted';
    await quest.save();
    await awardPointsToUsers(team, POINTS.QUEST_SUBMIT, 'Quest submit');
  }
  return quest;
}

export async function voteSubmission(questId, userId, submissionId) {
  const quest = await Quest.findById(questId);
  if (!quest) throw new Error('Quest not found');
  if (quest.status !== 'voting') throw new Error('Voting not open');
  if (!quest.participants.map(String).includes(String(userId))) throw new Error('Not a participant');

  const sub = quest.submissions.id(submissionId);
  if (!sub) throw new Error('Submission not found');
  const isOwnTeam = sub.team.map(String).includes(String(userId));
  if (isOwnTeam) throw new Error('Cannot vote own team');
  const already = sub.votes.map(String).includes(String(userId));
  if (already) throw new Error('Already voted');

  sub.votes.push(userId);
  await quest.save();
  return quest;
}


