import React, { useState, useEffect } from 'react';
import { Send, User as UserIcon, Clock, Trash2 } from 'lucide-react';
import { commentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CommentSectionProps {
    postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchComments = async () => {
        try {
            const response = await commentService.getByPost(postId);
            setComments(response.data);
        } catch (err) {
            console.error('Erro ao buscar comentários', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment || !user) return;

        setLoading(true);
        try {
            await commentService.create(postId, newComment);
            setNewComment('');
            fetchComments();
        } catch (err) {
            console.error('Erro ao comentar', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Tem certeza que deseja deletar este comentário?')) return;

        try {
            await commentService.delete(postId, commentId);
            fetchComments();
        } catch (err) {
            console.error('Erro ao deletar comentário', err);
            alert('Erro ao deletar comentário');
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Comentários ({comments.length})
            </h3>

            {user && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.8rem' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adicione um comentário..."
                        style={{
                            flex: 1,
                            padding: '0.8rem 1rem',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            color: 'white'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newComment}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.8rem 1.2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Send size={16} />
                    </button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fetching ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Carregando comentários...</p>
                ) : comments.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nenhum comentário ainda. Seja o primeiro!</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className="glass-card" style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                <UserIcon size={14} color="var(--primary)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{comment.userName || 'Usuário'}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} /> Justo agora
                                </span>
                                {user && (user.id === comment.userId) && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px', marginLeft: '4px' }}
                                        title="Deletar comentário"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{comment.texto}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
