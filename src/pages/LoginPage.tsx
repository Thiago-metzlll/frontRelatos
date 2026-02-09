import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
    onSuccess: () => void;
    onRegisterClick?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onRegisterClick }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login({ email, senha: password });
            } else {
                await register({ nome: name, email, senha: password });
                setIsLogin(true);
                setError('Conta criada com sucesso! Faça login.');
                return;
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar operação');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? 'Entre para compartilhar seus relatos' : 'Junte-se à nossa comunidade'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {!isLogin && (
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Senha</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#f43f5e', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="button-primary" style={{ marginTop: '1rem', padding: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                        {isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => onRegisterClick ? onRegisterClick() : setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
