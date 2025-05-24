// Products related functions
const products = {
    // Fetch all products
    async getAllProducts() {
        const { data: products, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        return products;
    },

    // Fetch single product by ID
    async getProductById(id) {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return null;
        }
        return product;
    },

    // Add new product
    async addProduct(productData) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData]);

        if (error) {
            console.error('Error adding product:', error);
            return null;
        }
        return data;
    },

    // Update product
    async updateProduct(id, productData) {
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            return false;
        }
        return true;
    },

    // Delete product
    async deleteProduct(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return false;
        }
        return true;
    }
}; 