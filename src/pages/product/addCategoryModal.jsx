import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCreateCategory ,  useCategories  } from '@/hooks/useProducts';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  prefix: Yup.string()
    .matches(/^[A-Za-z0-9]{3}$/, 'Must be exactly 3 alphanumeric characters')
    .required('Required'),
  description: Yup.string()
    .nullable()
});

const AddCategoryModal = ({ open, handleClose }) => {
  const createCategory = useCreateCategory();
  const { refetch: refetchCategories } = useCategories();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Category</DialogTitle>
      <Formik
        initialValues={{ 
          name: '', 
          prefix: '',
          description: '' 
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createCategory.mutateAsync(values);
            refetchCategories();
            resetForm();
            handleClose();
          } catch (error) {
            console.error('Error creating category:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="name"
                label="Category Name"
                fullWidth
                margin="normal"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                name="prefix"
                label="Category Prefix (3 characters)"
                fullWidth
                margin="normal"
                error={touched.prefix && errors.prefix}
                helperText={touched.prefix && errors.prefix}
              />
              <Field
                as={TextField}
                name="description"
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                error={touched.description && errors.description}
                helperText={touched.description && errors.description}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddCategoryModal;