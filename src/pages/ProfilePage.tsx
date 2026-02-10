import { useState, useEffect } from 'react';
import { User as UserIcon, ArrowLeft, MessageSquare, Award, Zap, Star, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { postService, userService } from '../services/api';
import PostCard from '../components/PostCard';

// Background Images from Assets
import bgNebulosa from '../assets/Gemini_Generated_Image_6bgs3z6bgs3z6bgs.png';
import bgAurora from '../assets/Gemini_Generated_Image_ds94iyds94iyds94.png';
import bgCosmos from '../assets/Gemini_Generated_Image_mvqhn1mvqhn1mvqh.png';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Image as ImageIcon } from 'lucide-react';

interface ProfilePageProps {
    onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
    const { user } = useAuth();
    const { theme, setTheme, bgImage, setBgImage } = useTheme();
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [showBgPicker, setShowBgPicker] = useState(false);

    // Mock avatars (the user mentioned putting them in assets)
    const availableAvatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoey',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    ];

    const backgroundImages = [
        { name: 'Nebulosa Azul', url: bgNebulosa },
        { name: 'Aurora Etérea', url: bgAurora },
        { name: 'Cosmos Vibrante', url: bgCosmos },
    ];

    const themesList = [
        { id: 'default', name: 'Padrão (Amarelo)', color: '#facc15' },
        { id: 'mystic', name: 'Místico (Vermelho)', color: '#991b1b' },
        { id: 'tech', name: 'Tech (Magenta)', color: '#d946ef' },
        { id: 'orkut', name: 'Nostalgia (Azul)', color: '#2563eb' },
        { id: 'nature', name: 'Natureza (Verde)', color: '#22c55e' },
        { id: 'ocean', name: 'Oceano (Ciano)', color: '#06b6d4' },
    ] as const;

    const handleAvatarSelect = async (avatar: string) => {
        try {
            await userService.updateProfile({ avatarUrl: avatar });
            alert('Avatar atualizado com sucesso!');
            // Idealmente recarregaríamos o perfil aqui
            setShowAvatarPicker(false);
            window.location.reload(); // Refresh simples para atualizar o estado global
        } catch (error) {
            console.error('Erro ao atualizar avatar:', error);
            alert('Falha ao atualizar avatar.');
        }
    };

    // Mock gamification data
    const mockGamification = {
        nivel: 5,
        xp: 750,
        nextLevelXp: 1000,
        insignias: [
            { id: 1, name: 'Bardo', icon: <Star size={16} />, color: '#f59e0b', description: 'Contador de histórias' },
            { id: 2, name: 'Tech Hunter', icon: <Zap size={16} />, color: '#8b5cf6', description: 'Entusiasta de tecnologia' },
            { id: 3, name: 'Veterano', icon: <Shield size={16} />, color: '#10b981', description: 'Membro antigo' }
        ]
    };

    const xpPercentage = (mockGamification.xp / mockGamification.nextLevelXp) * 100;

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
            const response = await postService.getUserPosts();
            setMyPosts(response.data);
        } catch (error) {
            console.error('Erro ao votar:', error);
        }
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <button
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                    opacity: 0.8
                }}
            >
                <ArrowLeft size={18} /> Voltar
            </button>

            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                {showAvatarPicker && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(var(--bg-dark), 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Escolha seu Avatar</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
                            {availableAvatars.map((src, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleAvatarSelect(src)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '20px',
                                        background: 'linear-gradient(45deg, var(--primary), var(--accent))',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        border: '3px solid rgba(255,255,255,0.2)',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <img src={src} alt={`Avatar ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowAvatarPicker(false)}
                            style={{
                                marginTop: '2.5rem',
                                background: 'none',
                                border: '1px solid var(--text-secondary)',
                                color: 'var(--text-main)',
                                padding: '10px 24px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(100px)',
                    opacity: 0.15,
                    borderRadius: '50%'
                }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowAvatarPicker(true)}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '30px',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                                border: '3px solid rgba(255,255,255,0.1)',
                                transition: 'transform 0.2s',
                                overflow: 'hidden'
                            }}>
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Seu Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UserIcon size={50} />
                                )}
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                right: '-8px',
                                background: 'var(--accent)',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                border: '3px solid var(--bg-dark)'
                            }}>
                                Nv. {mockGamification.nivel}
                            </div>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '30px',
                                background: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                opacity: 0,
                                transition: 'opacity 0.2s'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            >
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>ALTERAR</span>
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '0.3rem', color: 'var(--text-main)' }}>{user.nome}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.2rem' }}>{user.email}</p>

                            {/* Barra de Progresso */}
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Experiência</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{mockGamification.xp} / {mockGamification.nextLevelXp} XP</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${xpPercentage}%`,
                                    height: '100%',
                                    background: 'linear-gradient(to right, var(--primary), var(--accent))',
                                    borderRadius: '10px',
                                    transition: 'width 1s ease-out'
                                }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award size={18} /> Insígnias Conquistadas
                        </h4>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {mockGamification.insignias.map(badge => (
                                <div
                                    key={badge.id}
                                    title={badge.description}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.03)',
                                        border: `1px solid ${badge.color}44`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: badge.color,
                                        fontSize: '0.9rem',
                                        cursor: 'help'
                                    }}
                                >
                                    {badge.icon}
                                    <span style={{ fontWeight: '500' }}>{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seção de Personalização */}
                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '2rem', paddingTop: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Temas */}
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Palette size={18} /> Tema Visual
                            </h4>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                {themesList.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '12px',
                                            background: theme === t.id ? t.color : 'rgba(0,0,0,0.05)',
                                            border: `1px solid ${t.color}${theme === t.id ? '' : '44'}`,
                                            color: theme === t.id ? '#0f172a' : 'var(--text-main)',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Imagem de Fundo */}
                        <div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ImageIcon size={18} /> Imagem de Fundo
                            </h4>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => setShowBgPicker(true)}
                                    className="button-primary"
                                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                >
                                    {bgImage ? 'Mudar Fundo' : 'Escolher Fundo'}
                                </button>
                                {bgImage && (
                                    <button
                                        onClick={() => setBgImage(null)}
                                        style={{
                                            background: 'none',
                                            border: '1px solid var(--text-secondary)',
                                            color: 'var(--text-main)',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Picker para Background */}
                {showBgPicker && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(var(--bg-dark), 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}>
                        <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Escolha o seu Fundo</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '500px' }}>
                            {backgroundImages.map((bg, i) => (
                                <div
                                    key={i}
                                    onClick={() => { setBgImage(bg.url); setShowBgPicker(false); }}
                                    style={{
                                        aspectRatio: '16/9',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: bgImage === bg.url ? '3px solid var(--primary)' : '2px solid rgba(255,255,255,0.1)',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <img src={bg.url} alt={bg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        padding: '4px',
                                        textAlign: 'center'
                                    }}>
                                        {bg.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowBgPicker(false)}
                            style={{
                                marginTop: '2.5rem',
                                background: 'none',
                                border: '1px solid var(--text-secondary)',
                                color: 'var(--text-main)',
                                padding: '10px 24px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{myPosts.length}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Relatos Publicados</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {myPosts.reduce((acc, curr) => acc + curr.quantidadeVts, 0)}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Votos Recebidos</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Jan 2026</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Membro desde</p>
                </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquare size={22} color="var(--primary)" /> Meus Relatos
            </h3>

            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Buscando seus relatos...</p>
            ) : myPosts.length === 0 ? (
                <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Sua jornada ainda está começando.</p>
                    <button
                        onClick={onBack}
                        className="button-primary"
                        style={{ padding: '0.8rem 2rem' }}
                    >
                        Publicar meu primeiro relato
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
