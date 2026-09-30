import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { colors } from '../theme';
import { Category, Product } from '../types';
import { errorMessage } from '../utils';

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<{ data: Product[] }>('/products', {
        params: { perPage: 100, ...(categoryId && { categoryId }), ...(search && { search }) },
      });
      setProducts(data.data);
      setErro('');
    } catch (e) {
      setErro(errorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryId, search]);

  useEffect(() => {
    api.get<Category[]>('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce da busca
    return () => clearTimeout(t);
  }, [load]);

  return (
    <View style={s.container}>
      <TextInput style={s.search} placeholder="Buscar produto..." value={search} onChangeText={setSearch} />

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {[{ id: null, nome: 'Todos' }, ...categories].map((c) => {
            const active = categoryId === c.id;
            return (
              <TouchableOpacity key={c.id ?? 'all'} style={[s.chip, active && s.chipActive]} onPress={() => setCategoryId(c.id)}>
                <Text style={[s.chipText, active && { color: '#fff' }]}>{c.nome}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} size="large" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 12, gap: 10 }}
          renderItem={({ item }) => <ProductCard product={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          ListEmptyComponent={<Text style={s.empty}>{erro || 'Nenhum produto encontrado.'}</Text>}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  search: { margin: 12, marginBottom: 4, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 11, fontSize: 15 },
  chips: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontWeight: '600', color: colors.text },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40, paddingHorizontal: 20 },
});
