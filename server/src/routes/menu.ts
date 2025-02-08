import { Router, Request, Response } from 'express';
import { menuItems } from '../data/menu';

const router = Router();

// Get all menu items
router.get('/', (req: Request, res: Response) => {
  res.json(menuItems);
});

// Get menu item by id
router.get('/:id', (req: Request, res: Response) => {
  const item = menuItems.find(item => item.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

export default router; 