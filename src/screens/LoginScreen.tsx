import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { errorMessage } from '../utils';
import { API_URL } from '../config';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !senha) return Alert.alert('Atenção', 'Informe e-mail e senha.');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), senha);
    } catch (e) {
      Alert.alert('Erro ao entrar', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={s.title}>🥬 Hortifrúti</Text>
      <Text style={s.subtitle}>Frutas, verduras e legumes fresquinhos</Text>
      <Text style={{ textAlign: 'center', color: 'gray', fontSize: 12 }}>API: {API_URL}</Text>
      <TextInput style={s.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <TouchableOpacity style={s.button} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Entrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={s.link}>Não tem conta? <Text style={{ fontWeight: '700' }}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12, backgroundColor: colors.bg },
  title: { fontSize: 30, fontWeight: '800', color: colors.greenDark, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: colors.muted, marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 13, fontSize: 16 },
  button: { backgroundColor: colors.green, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', color: colors.green, marginTop: 8 },
});
