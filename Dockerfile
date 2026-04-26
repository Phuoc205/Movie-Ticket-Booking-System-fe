# Stage 1: Build React App bằng Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Vite sẽ build code vào thư mục /app/dist
RUN npm run build 

# Stage 2: Serve app bằng Nginx
FROM nginx:alpine

# Xóa trang mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file build từ Stage 1 sang thư mục của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx bạn vừa tạo
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]