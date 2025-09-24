import cron from 'node-cron';
import User from '../models/User.js';
import Quest from '../models/Quest.js';
import { pairStudentsPreferCrossGender } from '../services/pairingService.js';
import { assignMysteryPairs } from '../services/questsService.js';

export function startWeeklyCycle(io) {
  // Monday 08:00
  cron.schedule('0 8 * * 1', async () => {
    try {
      const students = await User.find({ roles: { $nin: ['admin'] } });
      const { pairs } = pairStudentsPreferCrossGender(students);
      const expiresAt = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // Thursday-ish
      await assignMysteryPairs('Co-create a meme about coding!', pairs, expiresAt, io);
      console.log('Weekly pairs assigned');
    } catch (e) {
      console.error('Pair assignment failed', e);
    }
  });

  // Thursday 18:00
  cron.schedule('0 18 * * 4', async () => {
    try {
      await Quest.updateMany({ status: 'assigned' }, { $set: { status: 'submitted' } });
      console.log('Submissions closed');
    } catch (e) {
      console.error('Close submissions failed', e);
    }
  });

  // Friday 10:00
  cron.schedule('0 10 * * 5', async () => {
    try {
      await Quest.updateMany({ status: 'submitted' }, { $set: { status: 'voting' } });
      console.log('Voting opened');
    } catch (e) {
      console.error('Open voting failed', e);
    }
  });

  // Saturday 09:00
  cron.schedule('0 9 * * 6', async () => {
    try {
      const votingQuests = await Quest.find({ status: 'voting' });
      for (const q of votingQuests) {
        const sorted = [...q.submissions].sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0));
        const winner = sorted[0];
        if (winner) {
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await User.updateMany({ _id: { $in: winner.team } }, {
            $push: {
              titles: { name: 'Connector Duo', icon: '🤝', expiresAt },
              badges: { name: 'Weekly Winner', icon: '🏆', expiresAt }
            }
          });
        }
        q.status = 'archived';
        await q.save();
      }
      io.emit('leaderboard:updated', { top: [] });
      console.log('Winners computed and leaderboard broadcast');
    } catch (e) {
      console.error('Compute winners failed', e);
    }
  });
}


