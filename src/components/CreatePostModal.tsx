import React, { useState, useEffect } from 'react';
import { X, Send, Tag } from 'lucide-react';
import { postService } from '../services/api';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const response = await postService.getCategories();
                    setCategories(response.data);
                    if (response.data.length > 0) {
                        setCategoryId(response.data[0].id);
                    }
                } catch (err) {
                    console.error('Erro ao buscar categorias', err);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !categoryId) return;

        setLoading(true);
        setError('');
        try {
            await postService.create({
                conteudo: content,
                tipoRelatoId: categoryId,
            });
            setContent('');
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao publicar relato');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Novo Relato</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoria</label>
                        <div style={{ position: 'relative' }}>
                            <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 0.8rem 0.8rem 2.5rem',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} style={{ background: '#1a1a1a' }}>
                                        {cat.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Conteúdo</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Conte sua história aqui..."
                            required
                            style={{
                                width: '100%',
                                height: '200px',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                resize: 'none',
                                lineHeight: '1.6'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: '#f43f5e', fontSize: '0.85rem' }}>{error}</p>}

                    <button
                        type="submit"
                        className="button-primary"
                        disabled={loading || !content}
                        style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Publicando...' : <><Send size={18} /> Publicar Relato</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
