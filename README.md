# 自动点餐系统

一个基于 React + Node.js 的完整自动点餐系统

## 功能特性

- 📖 菜单浏览：按分类查看菜品
- 🛒 购物车：添加、删除商品，修改数量
- 📝 下单：填写顾客信息和桌号完成下单
- 📋 订单管理：查看订单，更新订单状态（待处理/制作中/已完成/已取餐）
- ⚙️ 后台管理：添加、编辑、删除菜品

## 技术栈

- **前端**：React 18 + React Router 6
- **后端**：Node.js + Express
- **数据存储**：JSON文件

## 安装与运行

### 1. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

### 2. 启动服务

需要同时启动后端和前端服务（分别在两个终端中运行）：

**启动后端（端口 3001）：**
```bash
cd backend
npm start
```

**启动前端（端口 3000）：**
```bash
cd frontend
npm start
```

### 3. 访问系统

打开浏览器访问：http://localhost:3000

## 使用说明

### 点餐页面
- 浏览菜单，点击「加入购物车」添加菜品
- 右下角购物车可查看、修改已选菜品
- 点击「去结算」填写信息下单

### 订单页面
- 查看所有订单
- 更新订单状态：待处理 → 制作中 → 已完成 → 已取餐

### 后台管理页面
- 添加新菜品
- 编辑现有菜品信息
- 删除菜品

## 项目结构

```
milo2/
├── backend/
│   ├── server.js          # 后端服务器
│   ├── package.json
│   └── data/              # 数据存储目录（自动创建）
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```
