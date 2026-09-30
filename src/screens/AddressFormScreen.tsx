import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { api } from '../api';
import { colors } from '../theme';
import { errorMessage } from '../utils';

export default function AddressFormScreen({ navigation }: any) {
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      await api.post('/addresses', { rua: rua.trim(), numero: numero.trim(), bairro: bairro.trim(), cep: cep.trim() });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar', errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <TextInput style={s.input} placeholder="Rua" value={rua} onChangeText={setRua} />
      <TextInput style={s.input} placeholder="Número" value={numero} onChangeText={setNumero} />
      <TextInput style={s.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
      <TextInput style={s.input} placeholder="CEP (00000-000)" keyboardType="numbers-and-punctuation" value={cep} onChangeText={setCep} />
      <TouchableOpacity style={s.button} onPress={save} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Salvar endereço</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, gap: 12, backgroundColor: colors.bg, flexGrow: 1 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 13, fontSize: 16 },
  button: { backgroundColor: colors.green, padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
