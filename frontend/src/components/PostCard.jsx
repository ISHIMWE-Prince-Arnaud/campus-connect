
import { motion } from 'framer-motion';
import { FaLaugh, FaFire, FaThumbsUp, FaCrown, FaMedal } from 'react-icons/fa';
import { MdBedroomBaby } from 'react-icons/md';
import api from '../api/client.js';
import { toast } from 'react-hot-toast';

function Reaction({ icon: Icon, count, active, onClick, label, tooltip }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: .9 }}
      whileHover={{ scale: 1.05 }}
      className={`btn btn-sm gap-2 font-mono relative ${active ? 'btn-primary ring-2 ring-primary' : 'btn-ghost'} focus-visible`}
      aria-pressed={active}
      aria-label={label}
      tabIndex={0}
      data-tip={tooltip}
    >
      <Icon className={active ? 'text-accent' : 'text-base-content/70'} />
      <span>{count}</span>
      {active && (
        <span className="absolute -top-2 -right-2 badge badge-info text-xs">You</span>
      )}
    </motion.button>
  );
}

function PostCard({ post, onReacted, currentUserId }) {
  const counts = post.reactionCounts || { like: 0, laugh: 0, fire: 0, relatable: 0 };
  const userReactions = post.reactions || [];
  // Find the current user's reaction
  const myReaction = currentUserId
    ? userReactions.find(r => r.userId === currentUserId)
    : undefined;

  async function react(type) {
    try {
      const res = await api.post(`/posts/${post._id}/react`, { type });
      onReacted && onReacted(post._id, res.data.reactionCounts);
      toast.success('Reaction added!');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to react');
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 0 40px -10px rgba(99,102,241,0.25)' }}
      whileTap={{ scale: 0.98 }}
      className="card-elevated glass mb-6"
      tabIndex={0}
      aria-label={`Post by ${post.author?.displayName || post.author?.username}`}
    >
      <div className="card-body">
        <div className="flex items-center gap-3 mb-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden border">
              <img
                src={post.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.displayName || post.author?.username || '')}`}
                alt={`${post.author?.displayName || post.author?.username ? `${post.author?.displayName || post.author?.username}'s avatar` : 'Author avatar'}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="font-semibold text-base-content text-lg">
            {post.author?.displayName || post.author?.username}
          </div>
          {/* Example badges/titles */}
          {post.author?.titles?.length ? (
            <span className="badge badge-grad font-mono text-xs px-2 py-1 flex items-center gap-1">
              <FaCrown className="text-yellow-400" />
              {post.author.titles[0].name}
            </span>
          ) : null}
          {post.author?.badges?.length ? (
            <span className="badge badge-grad font-mono text-xs px-2 py-1 flex items-center gap-1">
              <FaMedal className="text-fuchsia-400" />
              {post.author.badges[0].name}
            </span>
          ) : null}
          <div className="badge font-mono text-xs ml-auto">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        <div
          className="mt-2 whitespace-pre-wrap leading-relaxed text-base-content/90 break-words overflow-auto"
          style={{ wordBreak: 'break-word', maxHeight: '20em' }}
        >
          {post.content}
        </div>
        {post.mediaUrl ? (
          <div className="flex gap-2 mt-3 flex-wrap w-full items-center justify-center">
            <img
              src={post.mediaUrl}
              alt="Post image"
              className="rounded-xl max-h-80 object-cover border border-white/10"
              style={{ maxWidth: '200px' }}
            />
          </div>
        ) : null}
        <div className="flex gap-3 mt-4 z-10 items-center justify-center">
          <Reaction
            icon={FaThumbsUp}
            count={counts.like}
            active={myReaction?.type === 'like'}
            onClick={() => react('like')}
            label="Like"
            tooltip="Like this post"
          />
          <Reaction
            icon={FaLaugh}
            count={counts.laugh}
            active={myReaction?.type === 'laugh'}
            onClick={() => react('laugh')}
            label="Laugh"
            tooltip="Laugh at this post"
          />
          <Reaction
            icon={FaFire}
            count={counts.fire}
            active={myReaction?.type === 'fire'}
            onClick={() => react('fire')}
            label="Fire"
            tooltip="This post is fire!"
          />
          <Reaction
            icon={MdBedroomBaby}
            count={counts.relatable}
            active={myReaction?.type === 'relatable'}
            onClick={() => react('relatable')}
            label="Relatable"
            tooltip="Relatable post"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;


