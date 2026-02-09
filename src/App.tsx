import { useState, useEffect } from 'react';
import { PlusCircle, Search, LogOut, User as UserIcon } from 'lucide-react';
import PostCard from './components/PostCard';
import { postService } from './services/api';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostModal from './components/CreatePostModal';

function App() {
  const { user, logout, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setFetchLoading(true);
      const response = await postService.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = async (id: number) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      await postService.vote(id);
      fetchPosts(); // Refresh votes
    } catch (error) {
      console.error('Erro ao votar:', error);
    }
  };

  const handleComment = (_id: number) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Carregando...</div>;
  }

  if (showLogin && !user) {
    return (
      <div style={{ padding: '2rem' }}>
        <button
          onClick={() => { setShowLogin(false); setIsRegistering(false); }}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          ← Voltar para os Relatos
        </button>
        {isRegistering ? (
          <RegisterPage
            onSuccess={() => { setIsRegistering(false); }}
            onBackToLogin={() => setIsRegistering(false)}
          />
        ) : (
          <LoginPage
            onSuccess={() => setShowLogin(false)}
            onRegisterClick={() => setIsRegistering(true)}
          />
        )}
      </div>
    );
  }

  if (showProfile && user) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  return (
    <div>
      <nav className="nav">
        <h1
          onClick={() => setShowProfile(false)}
          style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #8b5cf6, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}
        >
          Relatos Random
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="button-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => user ? setShowCreatePost(true) : setShowLogin(true)}
          >
            <PlusCircle size={18} /> Novo Relato
          </button>

          <div className="glass-card" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="var(--text-secondary)" />
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                onClick={() => setShowProfile(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}
              >
                <UserIcon size={18} />
                <span style={{ fontSize: '0.9rem' }}>{user.nome}</span>
              </div>
              <button
                onClick={() => { logout(); setShowProfile(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="glass-card"
              style={{ padding: '8px 16px', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer' }}
            >
              Entrar
            </button>
          )}
        </div>
      </nav>

      <main className="post-container">
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
          <span className="category-badge">Todos</span>
          <span className="category-badge" style={{ opacity: 0.5 }}>Tecnologia</span>
          <span className="category-badge" style={{ opacity: 0.5 }}>Dúvidas</span>
        </div>

        {fetchLoading ? (
          <p style={{ color: 'white' }}>Buscando relatos...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  author: post.user?.nome || 'Anônimo',
                  content: post.conteudo,
                  category: post.tipoRelato?.nome || 'Geral',
                  votes: post.quantidadeVts
                }}
                onVote={handleVote}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </main>
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSuccess={fetchPosts}
      />
    </div>
  );
}

export default App;
