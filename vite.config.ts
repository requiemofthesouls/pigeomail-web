import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        cors: false,
        proxy: {
            '/api/pigeomail/v1': {
                target: 'http://localhost:20202/',
                changeOrigin: true,
                secure: false,
            },
            '/stream': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                secure: false,
            },
            '/create_stream': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
