import { useState, useEffect } from 'react';
import { User as UserIcon, Calendar, ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';

interface ProfilePageProps {
    onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
    const { user } = useAuth();
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await postService.getUserPosts();
                setMyPosts(response.data);
            } catch (error) {
                console.error('Erro ao buscar meus relatos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyPosts();
    }, []);

    const handleVote = async (id: number) => {
        try {
            await postService.vote(id);
            // Refresh
            const response = await postService.getUserPosts();
            setMyPosts(response.data);
        } catch (error) {
            console.error('Erro ao votar:', error);
        }
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <button
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1rem'
                }}
            >
                <ArrowLeft size={18} /> Voltar
            </button>

            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    background: 'var(--primary)',
                    filter: 'blur(80px)',
                    opacity: 0.3,
                    borderRadius: '50%'
                }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}>
                        <UserIcon size={40} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.3rem', color: 'white' }}>{user.nome}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} /> Membro desde Jan 2026
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{myPosts.length}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Relatos</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                            {myPosts.reduce((acc, curr) => acc + curr.quantidadeVts, 0)}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Votos Recebidos</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Ativo</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</p>
                    </div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} color="var(--primary)" /> Meus Relatos
            </h3>

            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Buscando seus relatos...</p>
            ) : myPosts.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Você ainda não publicou nenhum relato.</p>
                    <button
                        onClick={onBack}
                        className="button-primary"
                        style={{ padding: '0.6rem 1.5rem' }}
                    >
                        Criar meu primeiro relato
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {myPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={{
                                id: post.id,
                                author: post.user?.nome || 'Você',
                                content: post.conteudo,
                                category: post.tipoRelato?.nome || 'Geral',
                                votes: post.quantidadeVts
                            }}
                            onVote={handleVote}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
