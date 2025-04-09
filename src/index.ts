import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { readDataJSON } from './utils/read.data.json';
import { writeDataJSON } from './utils/write.data.json';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Welcome to Express API');
  });

//1. Create a Purchase Order
app.post('/purchaseOrders', (req: Request, res: Response) => {
    try {
        const {itemName, category, quantity, supplier, status} = req.body;
  
      const data = readDataJSON();
        data.purchaseOrders.push({
        id: data.purchaseOrders[data.purchaseOrders.length - 1].id + 1,
        itemName,
        category,
        quantity,
        supplier,
        status,
      });
   
     writeDataJSON(data);
  
      res.status(201).json({
        success: true,
        message: 'Purchase order created successfully',
        data: { itemName, category, quantity, supplier, status },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  });

//2. Read All Purchase Orders
app.get('/purchaseOrders', (req: Request, res: Response) => {
  try {
    const data = readDataJSON();
  
    res.status(201).json({
      success: true,
      message: 'Get Purchase order successfully',
      data: data.purchaseOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

//3. Read a Purchase Order by ID
app.get('/purchaseOrders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { itemName, category, quantity, supplier, status } = req.body;

    const data = readDataJSON();

    const findIndex = data.purchaseOrders.findIndex(
      (item: any) => item.id === Number(id)
    );

    if (findIndex === -1) throw new Error(`Purchase Order with Id ${id} Not Found`);

    res.status(201).json({
      success: true,
      message: 'Get Purchase order successfully',
      data: data.purchaseOrders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

//4. Update  a Purchase Order
app.put('/purchaseOrders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {itemName, category, quantity, supplier, status} = req.body;

    const data = readDataJSON();
    const findIndex = data.purchaseOrders.findIndex(
      (item: any) => item.id === Number(id)
    );

    if (findIndex === -1) throw new Error(`Purchase Order with Id ${id} Not Found`);

    data.purchaseOrders[findIndex] = {
      ...data.purchaseOrders[findIndex],
      itemName,
      category,
      quantity,
      supplier,
      status,
    };

    writeDataJSON(data);

    res.status(200).json({
      success: true,
      message: `Update Purchase Order with Id ${id} Success`,
      data: { itemName, category, quantity, supplier, status },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});

//5. Delete a Purchase Order
app.delete('/purchaseOrders/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = readDataJSON();

    const findIndex = data.purchaseOrders.findIndex(
      (item: any) => item.id == Number(id)
    );

    if (findIndex === -1) throw new Error(`Purchase Order with Id ${id} Not Found`);

    data.purchaseOrders.splice(findIndex, 1);

    writeDataJSON(data);

    res.status(200).json({
      success: true,
      message: `Delete Puchase Order with Id ${id} Success`,
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
});


// Postman: http://localhost:5000/purchaseOrders
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
