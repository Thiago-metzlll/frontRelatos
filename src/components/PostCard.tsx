import React, { useState } from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import CommentSection from './CommentSection';

interface PostCardProps {
    post: {
        id: number;
        author: string;
        content: string;
        category: string;
        votes: number;
    };
    onVote: (id: number) => void;
    onComment?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onVote, onComment }) => {
    const [showComments, setShowComments] = useState(false);

    const handleCommentToggle = () => {
        setShowComments(!showComments);
        if (onComment) onComment(post.id);
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Por u/{post.author}</span>
                <span className="category-badge">{post.category}</span>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{post.content}</p>
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <button
                    onClick={() => onVote(post.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <ThumbsUp size={18} /> {post.votes}
                </button>
                <button
                    onClick={handleCommentToggle}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: showComments ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <MessageSquare size={18} /> {showComments ? 'Ocultar Comentários' : 'Comentar'}
                </button>
            </div>

            {showComments && <CommentSection postId={post.id} />}
        </div>
    );
};

export default PostCard;
