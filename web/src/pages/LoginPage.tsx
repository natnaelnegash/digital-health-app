import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { login } from '../api/authApi'; // Adjust the import according to your project structure
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Loader } from '../components/Loader';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        // setSuccess(null);
        setLoading(true);

        try {
            const response = await login(formData);
            console.log("response token:", response, "\n\nuserDetail", response.userDetail)
            if(response.token){
                localStorage.setItem('token', response.token); 
                // navigate('/dashboard');
                if(response.userDetail.role === 'ADMIN'){
                    navigate('/admin-dashboard'); 
                }
                else if(response.userDetail.role === 'PATIENT'){
                    navigate('/patient-dashboard');
                }
            }
            // Redirect or perform further actions here
            // Example: navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // const handleRegisterClick = () => {
    //     navigate('/register'); // Redirect to the register page
    // };

    return (
        <div
            style={{
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: 'url(/Blue.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '1rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // padding: '1rem 2rem',
                    // flexWrap: 'wrap',           // allows wrapping on small screens
                }}
            >
                <h1
                    style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: 0,
                    flex: '1 1 auto',         
                    color: 'white'
                    }}
                >
                    Digital Health System
                </h1>

                {/* Flag and Language */}
                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: '0 0 auto',
                    marginTop: '0.5rem',       // spacing if wraps on small screens
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',         
                    borderRadius: '0.2rem',
                    backgroundColor: 'white',
                    padding: '0.25rem 0.5rem',
                    }}
                >
                     <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        English
                        <ChevronDown style={{ width: '16px', height: '16px' }} />
                    </span>
                </div>
            </div>

            <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
                minHeight: '80vh',
            }}>
            
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '28rem',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                }}
            >
                <h2
                    style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    textAlign: 'center',
                    color: '#2563EB', // blue primary color
                    marginBottom: '0.5rem',
                    }}
                >
                    Login
                </h2>

                {error && (
                    <p style={{ color: 'red', textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', color: '#4B5563' }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        boxSizing: 'border-box',
                        }}
                    />
                    </div>

                    <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', color: '#4B5563' }}>
                        Password
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        boxSizing: 'border-box',
                        }}
                    />
                    {formData.password && (formData.password.length < 8 || formData.password.length > 100) && (
                    <small style={{ color: 'red', fontSize: '0.75rem' }}>
                        Password should be 8–100 characters long
                    </small>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        //   className="hover:text-primary transition border-none transparent" style={{position: 'absolute', top: '28px', right: '0.75rem',}}
                        style={{
                            position: 'absolute',
                            top: '28px',
                            right: '0.75rem',
                            background: 'transparent',
                            border: 'none',       
                            padding: 0,         
                            cursor: 'pointer',     
                        }}  
                        tabIndex={-1}
                        >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                    type="submit"
                    style={{
                        width: '100%',
                        backgroundColor: '#2563EB',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        
                    }}
                    >
                    {loading ? <Loader /> : 'Login'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                    Don't have an account?{' '}
                    <span
                        onClick={() => navigate('/register')} // or use <a href="/register">
                        style={{
                        color: '#2563EB',       // primary blue
                        textDecoration: 'none', // remove default underline
                        cursor: 'pointer',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                        Register
                    </span>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;