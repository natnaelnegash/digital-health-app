import React, { useState } from 'react';
import { register } from '../api/authApi'; // Adjust the import according to your project structure
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Loader } from '../components/Loader';

const Register: React.FC = () => {
    const initialFormData = { email: '', password: '', firstname: '', lastname: '', role: 'PATIENT' };
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response= await register(formData);
            if(response && response?.token){
                localStorage.setItem('token', response.token);
                setFormData(initialFormData);
                //   navigate('/dashboard');
                if(response.userDetail.role === 'ADMIN'){
                    navigate('/admin-dashboard'); 
                }
                else if(response.userDetail.role === 'PATIENT'){
                    navigate('/patient-dashboard');
                }
            }
            setFormData(initialFormData);
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred');
            setFormData(initialFormData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
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
                        Register
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
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="First Name"
                                value={formData.firstname}
                                onChange={handleChange}
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#4B5563' }}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Last Name"
                                value={formData.lastname}
                                onChange={handleChange}
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

                      <div>
                        <label style={{ display: 'block', marginBottom: '0.25rem', color: '#4B5563' }}>
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #D1D5DB',
                            boxSizing: 'border-box',
                            backgroundColor: 'white',
                            }}
                        >
                            <option value="">Select Role</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="PATIENT">PATIENT</option>
                            <option value="USER">PROVIDER</option>
                        </select>
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
                        {loading ? <Loader /> : 'Register'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/')}
                            style={{
                            color: '#2563EB',    
                            textDecoration: 'none',
                            cursor: 'pointer',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                            LogIn
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;