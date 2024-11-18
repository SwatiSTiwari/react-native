import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import Button from '@/components/Button';
import SignInScreen from '../(auth)/sign-in';
import SignUpScreen from '../(auth)/sign-up';

export default function TabIndex () {
  return <Redirect href={'/(user)/menu/'} />;

  
};

