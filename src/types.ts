export type Unidade = 'KG' | 'UNIT';
export type OrderStatus = 'AGUARDANDO_PAGAMENTO' | 'EM_SEPARACAO' | 'EM_TRANSPORTE' | 'CONCLUIDO';
export type FormaPagamento = 'PIX' | 'CARTAO' | 'DINHEIRO';

export interface User { id: string; nome: string; email: string; role: 'CLIENT' | 'ADMIN' }
export interface Category { id: string; nome: string }

export interface Product {
  id: string;
  categoryId: string;
  nome: string;
  unidadeMedida: Unidade;
  precoVarejo: string;
  precoAtacado: string | null;
  qtdMinAtacado: string | null;
  category?: Category;
}

export interface Address { id: string; rua: string; numero: string; bairro: string; cep: string }

export interface OrderItem {
  id: string;
  quantidade: string;
  precoUnitario: string;
  subtotal: string;
  product: { id: string; nome: string; unidadeMedida: Unidade };
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: string;
  formaPagamento: FormaPagamento;
  data: string;
  address: Address;
  items: OrderItem[];
}
