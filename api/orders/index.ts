import { useAuth } from '@/app/providers/AuthProvider';
import { supabase } from '@/lib/superbase';
import { Order, OrderStatus } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { InsertTables, Tables, UpdateTables } from '@/types';

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', statuses)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMyOrderList = (p0: { archived: boolean; }) => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['orders', { userId: id }],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      const { error, data: newProduct } = await supabase
        .from('orders')
        .insert({ ...data, user_id: userId })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['orders']);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<'orders'>;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries(['orders']);
      await queryClient.invalidateQueries(['orders', id]);
    },
  });
};


// export const useUpdateOrder = () => {
//     const queryClient = useQueryClient();
  
//     return useMutation({
//       async mutationFn({ id, status }: Pick<Order, 'id' | 'status'>) {
//         const { data, error } = await supabase
//           .from('orders')
//           .update({ status })
//           .eq('id', id)
//           .select();
  
//         if (error) {
//           throw error;
//         }
//         return data;
//       },
//       async onSuccess(_, { id }) {
//         await queryClient.invalidateQueries(['orders']);
//         await queryClient.invalidateQueries(['order', id]);
//       },
//       onError(error) {
//         console.log(error);
//       },
//     });
//   };