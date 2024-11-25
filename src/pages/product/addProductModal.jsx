import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  MenuItem, IconButton, Box, Typography, Divider 
} from '@mui/material';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useCreateProduct, useAttributes } from '@/hooks/useProducts';

const validationSchema = Yup.object().shape({
  product_name: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  product_category_id: Yup.number()
    .required('Required'),
  reorder_level: Yup.number()
    .min(0, 'Must be 0 or greater')
    .required('Required'),
  product_type: Yup.string()
    .oneOf(['raw', 'finished', 'custom'], 'Invalid product type')
    .required('Required'),
  attributes: Yup.array().of(
    Yup.object().shape({
      attribute_id: Yup.number().required('Required'),
      value: Yup.number().required('Required')
    })
  )
});

const AddProductModal = ({ open, handleClose, categories }) => {
  const createProduct = useCreateProduct();
  const { data: attributes = [] } = useAttributes();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <Formik
        initialValues={{
          product_name: '',
          product_category_id: '',
          reorder_level: 0,
          product_type: 'finished',
          attributes: []
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createProduct.mutateAsync(values);
            resetForm();
            handleClose();
          } catch (error) {
            console.error('Error creating product:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="product_name"
                label="Product Name"
                fullWidth
                margin="normal"
                error={touched.product_name && errors.product_name}
                helperText={touched.product_name && errors.product_name}
              />
              <Field
                as={TextField}
                select
                name="product_category_id"
                label="Category"
                fullWidth
                margin="normal"
                error={touched.product_category_id && errors.product_category_id}
                helperText={touched.product_category_id && errors.product_category_id}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                name="reorder_level"
                label="Reorder Level"
                type="number"
                fullWidth
                margin="normal"
                error={touched.reorder_level && errors.reorder_level}
                helperText={touched.reorder_level && errors.reorder_level}
              />
              <Field
                as={TextField}
                select
                name="product_type"
                label="Product Type"
                fullWidth
                margin="normal"
                error={touched.product_type && errors.product_type}
                helperText={touched.product_type && errors.product_type}
              >
                <MenuItem value="raw">Raw Material</MenuItem>
                <MenuItem value="finished">Finished Product</MenuItem>
                <MenuItem value="custom">Custom Product</MenuItem>
              </Field>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Product Attributes
              </Typography>

              <FieldArray name="attributes">
                {({ push, remove }) => (
                  <Box>
                    {values.attributes.map((attr, index) => (
                      <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Field
                          as={TextField}
                          select
                          name={`attributes.${index}.attribute_id`}
                          label="Attribute"
                          fullWidth
                          error={
                            touched.attributes?.[index]?.attribute_id && 
                            errors.attributes?.[index]?.attribute_id
                          }
                          helperText={
                            touched.attributes?.[index]?.attribute_id && 
                            errors.attributes?.[index]?.attribute_id
                          }
                        >
                          {attributes.map((attr) => (
                            <MenuItem key={attr.id} value={attr.id}>
                              {attr.attribute_name} ({attr.unit_of_measurement})
                            </MenuItem>
                          ))}
                        </Field>
                        <Field
                          as={TextField}
                          name={`attributes.${index}.value`}
                          label="Value"
                          type="number"
                          fullWidth
                          error={
                            touched.attributes?.[index]?.value && 
                            errors.attributes?.[index]?.value
                          }
                          helperText={
                            touched.attributes?.[index]?.value && 
                            errors.attributes?.[index]?.value
                          }
                        />
                        <IconButton 
                          onClick={() => remove(index)}
                          color="error"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      type="button"
                      onClick={() => push({ attribute_id: '', value: '' })}
                      startIcon={<PlusOutlined />}
                      variant="outlined"
                      fullWidth
                    >
                      Add Attribute
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddProductModal;