import { Router } from 'express';

import auth from './auth.route';
import user from './user.route';
import role from './role.route';
import unit from './unit.route';
import category from './category.route';
import product from './product.route';
import warehouse from './warehouse.route';
import pricelist from './pricelist.route';
import supplier from './supplier.route';
import client from './client.route';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/roles', role);
router.use('/units', unit);
router.use('/categories', category);
router.use('/products', product);
router.use('/warehouses', warehouse);
router.use('/pricelists', pricelist);
router.use('/suppliers', supplier);
router.use('/clients', client);

export default router;
