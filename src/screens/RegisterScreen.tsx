import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { errorMessage } from '../utils';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (nome.trim().length < 2) return Alert.alert('Atenção', 'Informe seu nome.');
    if (senha.length < 6) return Alert.alert('Atenção', 'A senha deve ter ao menos 6 caracteres.');
    setLoading(true);
    try {
      await register(nome.trim(), email.trim().toLowerCase(), senha);
    } catch (e) {
      Alert.alert('Erro no cadastro', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <TextInput style={s.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
      <TextInput style={s.input} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Senha (mín. 6 caracteres)" secureTextEntry value={senha} onChangeText={setSenha} />
      <TouchableOpacity style={s.button} onPress={submit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Criar conta</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 24, gap: 12, backgroundColor: colors.bg, flexGrow: 1 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 13, fontSize: 16 },
  button: { backgroundColor: colors.green, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
