const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const ROLES = {
  customer: { username: 'guest', role: 'customer', displayName: '贵宾' },
  staff: { username: 'staff', role: 'staff', displayName: '侍者' }
};

const sessions = new Map();

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const initData = () => {
  if (!fs.existsSync(MENU_FILE)) {
    const initialMenu = [
      { id: 1, name: '宫保鸡丁', price: 28, category: '热菜', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=delicious%20kung%20pao%20chicken%20in%20a%20white%20plate&image_size=square', description: '经典川菜，麻辣鲜香' },
      { id: 2, name: '红烧肉', price: 38, category: '热菜', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=braised%20pork%20belly%20in%20brown%20sauce%20on%20a%20plate&image_size=square', description: '肥而不腻，入口即化' },
      { id: 3, name: '麻婆豆腐', price: 18, category: '热菜', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mapo%20tofu%20spicy%20sichuan%20dish&image_size=square', description: '麻辣鲜香，嫩滑可口' },
      { id: 4, name: '酸辣土豆丝', price: 15, category: '热菜', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=spicy%20and%20sour%20shredded%20potatoes&image_size=square', description: '爽脆可口，开胃下饭' },
      { id: 5, name: '鱼香肉丝', price: 25, category: '热菜', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=yuxiang%20shredded%20pork%20chinese%20dish&image_size=square', description: '酸甜咸香，口感丰富' },
      { id: 6, name: '清炒时蔬', price: 16, category: '素菜', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stir%20fried%20green%20vegetables&image_size=square', description: '新鲜健康，清淡美味' },
      { id: 7, name: '蛋炒饭', price: 12, category: '主食', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fried%20rice%20with%20egg%20and%20vegetables&image_size=square', description: '粒粒分明，香气四溢' },
      { id: 8, name: '番茄蛋汤', price: 10, category: '汤类', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tomato%20egg%20soup%20in%20a%20bowl&image_size=square', description: '酸甜开胃，营养丰富' }
    ];
    fs.writeFileSync(MENU_FILE, JSON.stringify(initialMenu, null, 2));
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
};

initData();

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const getSession = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return sessions.get(auth.slice(7)) || null;
};

const requireRole = (...roles) => (req, res, next) => {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: '请先选择身份进入' });
  }
  if (!roles.includes(session.role)) {
    return res.status(403).json({ error: '无权访问' });
  }
  req.user = session;
  next();
};

app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  const account = ROLES[role];

  if (!account) {
    return res.status(400).json({ error: '无效的身份' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  const user = { ...account };
  sessions.set(token, user);
  res.json({ token, user });
});

app.post('/api/auth/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    sessions.delete(auth.slice(7));
  }
  res.json({ message: '已退出' });
});

app.get('/api/auth/me', (req, res) => {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: '未登录' });
  }
  res.json({ user: session });
});

app.get('/api/menu', (req, res) => {
  res.json(readData(MENU_FILE));
});

app.post('/api/menu', requireRole('staff'), (req, res) => {
  const menu = readData(MENU_FILE);
  const newItem = { id: Date.now(), ...req.body };
  menu.push(newItem);
  writeData(MENU_FILE, menu);
  res.json(newItem);
});

app.put('/api/menu/:id', requireRole('staff'), (req, res) => {
  const menu = readData(MENU_FILE);
  const index = menu.findIndex((item) => item.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: '菜品不存在' });
  }
  menu[index] = { ...menu[index], ...req.body };
  writeData(MENU_FILE, menu);
  res.json(menu[index]);
});

app.delete('/api/menu/:id', requireRole('staff'), (req, res) => {
  let menu = readData(MENU_FILE);
  menu = menu.filter((item) => item.id !== parseInt(req.params.id, 10));
  writeData(MENU_FILE, menu);
  res.json({ message: '已删除' });
});

app.get('/api/orders', requireRole('staff'), (req, res) => {
  res.json(readData(ORDERS_FILE));
});

app.get('/api/orders/my', requireRole('customer'), (req, res) => {
  const orders = readData(ORDERS_FILE);
  res.json(orders.filter((order) => order.customerUsername === req.user.username));
});

app.post('/api/orders', requireRole('customer'), (req, res) => {
  const orders = readData(ORDERS_FILE);
  const newOrder = {
    id: Date.now(),
    orderNumber: Date.now().toString().slice(-6),
    items: req.body.items,
    total: req.body.total,
    customer: req.body.customer || '',
    tableNumber: req.body.tableNumber || '',
    customerUsername: req.user.username,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  writeData(ORDERS_FILE, orders);
  res.json(newOrder);
});

app.put('/api/orders/:id/status', requireRole('staff'), (req, res) => {
  const orders = readData(ORDERS_FILE);
  const index = orders.findIndex((order) => order.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: '订单不存在' });
  }
  orders[index].status = req.body.status;
  writeData(ORDERS_FILE, orders);
  res.json(orders[index]);
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
