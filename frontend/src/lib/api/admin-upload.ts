const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const adminUploadApi = {
    uploadImage: async (file: File, token: string) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/admin/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    },

    uploadImages: async (files: File[], token: string) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch(`${API_URL}/admin/upload/images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    }
};
