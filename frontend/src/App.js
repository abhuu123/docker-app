import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Paper, Avatar, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import { Add, Delete, Edit, Palette } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import './App.css';

const ColorOptions = [
  '#4CAF50', '#2196F3', '#9C27B0', '#FF5722',
  '#FFEB3B', '#607D8B', '#E91E63', '#00BCD4'
];

// Enhanced API configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000'  // For development outside Docker
    : '/api',                  // For production (handled by proxy)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '#4CAF50'
  });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching items from:', api.defaults.baseURL);
      
      // Test backend connection first
      await api.get('/health');
      
      const { data } = await api.get('/items');
      console.log('API Response:', data);
      setItems(data);
    } catch (error) {
      console.error('API Error:', {
        config: error.config,
        response: error.response,
        message: error.message
      });
      
      let errorMessage = 'Failed to load items';
      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server';
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, form);
        showSnackbar('Item updated!', 'success');
      } else {
        await api.post('/items', form);
        showSnackbar('Item created!', 'success');
      }
      setOpen(false);
      setForm({ name: '', description: '', color: '#4CAF50' });
      setEditingId(null);
      await fetchItems();
    } catch (error) {
      console.error('Submission Error:', error.response?.data || error.message);
      showSnackbar(
        error.response?.data?.error || 'Failed to save item',
        'error'
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      showSnackbar('Item deleted!', 'success');
      await fetchItems();
    } catch (error) {
      console.error('Deletion Error:', error.response?.data || error.message);
      showSnackbar(
        error.response?.data?.error || 'Failed to delete item',
        'error'
      );
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Notification System */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* App Header */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          p: 3,
          borderRadius: 2,
          mb: 4,
          boxShadow: 3
        }}
      >
        <Typography variant="h3" color="white" fontWeight="bold">
          Funky CRUD App 🎉
        </Typography>
      </Box>

      {/* Main Content */}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        Add New Item
      </Button>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="secondary" />
        </Box>
      ) : items.length > 0 ? (
        <Box
          component={motion.div}
          layout
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3
          }}
        >
          {items.map((item) => (
            <Paper
              key={item.id}
              component={motion.div}
              layout
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              sx={{
                p: 3,
                borderRadius: 2,
                borderLeft: `5px solid ${item.color}`,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                  {item.name}
                </Typography>
                <Chip
                  label={item.color}
                  size="small"
                  sx={{
                    backgroundColor: item.color,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                {item.description}
              </Typography>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton onClick={() => {
                  setForm({
                    name: item.name,
                    description: item.description,
                    color: item.color
                  });
                  setEditingId(item.id);
                  setOpen(true);
                }}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => {
                  if (window.confirm('Delete this item?')) {
                    handleDelete(item.id);
                  }
                }}>
                  <Delete color="error" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary" textAlign="center" mt={4}>
          No items found. Create one to get started!
        </Typography>
      )}

      {/* Item Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId ? 'Edit Item' : 'Create New Item'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Select Color:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {ColorOptions.map((color) => (
                  <Avatar
                    key={color}
                    sx={{
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: form.color === color ? '3px solid #1976D2' : 'none',
                      width: 32,
                      height: 32
                    }}
                    onClick={() => setForm({...form, color})}
                  >
                    {form.color === color && <Palette sx={{ color: 'white' }} />}
                  </Avatar>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.name}
          >
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
