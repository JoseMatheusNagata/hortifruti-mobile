import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function AccountScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.name}>{user?.nome}</Text>
        <Text style={s.email}>{user?.email}</Text>
      </View>
      <TouchableOpacity style={s.button} onPress={logout}>
        <Text style={s.buttonText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: colors.bg },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 4 },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  email: { color: colors.muted },
  button: { borderWidth: 1.5, borderColor: colors.danger, padding: 13, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: colors.danger, fontWeight: '700' },
});
