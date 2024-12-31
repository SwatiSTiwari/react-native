import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../../types';

import { supabase } from '@/lib/superbase';

export const useProductList = () => {
  return useQuery<Product[]>({
    queryKey: ['product'],
    queryFn: async () => {
      const { data, error } = await supabase.from('product').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};


export const useProduct = (id: number) => {
    return useQuery<Product>({
      queryKey: ['product', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('product')
          .select('*')
          .eq('id', id)
          .single();
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };



  
export const useInsertProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(data: Omit<Product, 'id'>) {
        const { error } = await supabase.from('product').insert({
          name: data.name,
          price: data.price,
          image: data.image,
        });
  
        if (error) {
          throw error;
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries(['product']);
      },
      onError(error) {
        console.log(error);
      },
    });
  };




  export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn({ id, ...update }: Product) {
        const { data, error } = await supabase
          .from('product')
          .update(update)
          .eq('id', id)
          .select();
  
        if (error) {
          throw error;
        }
        return data;
      },
      async onSuccess(_, { id }) {
        await queryClient.invalidateQueries(['product']);
        await queryClient.invalidateQueries(['product', id]);
      },
      onError(error) {
        console.log(error);
      },
    });
  };


  export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      async mutationFn(id: number) {
        const { error } = await supabase.from('product').delete().eq('id', id);
        if (error) {
          throw new Error(error.message);
        }
      },
      async onSuccess() {
        await queryClient.invalidateQueries(['product']);
      },
    });
  };