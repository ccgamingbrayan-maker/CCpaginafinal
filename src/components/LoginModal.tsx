import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  font-family: 'Sora', sans-serif;
`;

const ModalContainer = styled.div`
  background-color: #2D2D2D;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #D2D2D2;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(167, 31, 208, 0.1);
    color: #a71fd0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  background-color: #0f0f0f;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a71fd0;
    box-shadow: 0 0 0 3px rgba(167, 31, 208, 0.1);
  }
`;

const SubmitButton = styled.button`
  background-color: #40C485;
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Sora', sans-serif;
  margin-top: 0.5rem;

  &:hover {
    background-color: #008f4a;
  }
`;

const DemoCredentials = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(167, 31, 208, 0.1);
  border-radius: 0.5rem;
  border-left: 3px solid #a71fd0;

  p {
    color: #D2D2D2;
    font-size: 0.75rem;
    margin: 0 0 0.25rem 0;

    &:first-child {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }
`;

// Component
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'hobbyshop123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('isOwnerLoggedIn', 'true');
      toast.success('Login successful!');
      onClose();
      navigate('/admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Owner Login</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <StyledInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <StyledInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <SubmitButton type="submit">Login</SubmitButton>
        </Form>

        <DemoCredentials>
          <p>Demo credentials:</p>
          <p>Username: admin</p>
          <p>Password: hobbyshop123</p>
        </DemoCredentials>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoginModal;
