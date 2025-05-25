import React, { useState } from 'react';

// Optional: import a new CSS file like './LoginScreen.css' if you prefer separate styling.
// For this task, styles will be added to src/App.css

function LoginScreen({ onLoginSuccess }) { // onLoginSuccess prop for later use
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // If using a form
    console.log('Login attempt with:', email, password);
    // Simulate successful login for now
    if (onLoginSuccess) { // Check if the prop is provided
      onLoginSuccess();
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Login clicked');
    // Simulate successful Google login for now
    if (onLoginSuccess) { // Check if the prop is provided
      onLoginSuccess();
    }
  };

  return (
    <div className="login-screen-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      {/* Optional: Add a divider or some spacing if needed */}
      {/* <div className="divider" style={{ margin: '16px 0', textAlign: 'center' }}>OR</div> */}
      <button onClick={handleGoogleLogin} className="google-login-button">
        Login with Google
      </button>
    </div>
  );
}

export default LoginScreen;
