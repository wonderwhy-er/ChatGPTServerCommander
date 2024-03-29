const express = require('express');
const { createAppInFirestore } = require('../serverModules/firebaseDB');

const createAppHandler = async (req, res) => {
  try {
    const appData = req.body;
    const { id, publicId } = await createAppInFirestore(appData);
    res.status(201).json({ message: 'App created successfully', id, publicId });
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createAppHandler };
