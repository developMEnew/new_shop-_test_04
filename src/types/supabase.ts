export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          purchase_price: number;
          selling_price: number;
          quantity: number;
          category: string;
          supplier: string;
          date_added: string;
          image_url: string;
        };
        Insert: Omit<Database['public']['Tables']['books']['Row'], 'id' | 'date_added'>;
        Update: Partial<Database['public']['Tables']['books']['Insert']>;
      };
    };
    Functions: {
      init_books_table: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
  };
}