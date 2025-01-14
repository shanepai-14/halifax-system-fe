import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Switch } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCreateCostType } from '@/hooks/useCostTypes';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Too Short!')
    .max(100, 'Too Long!'),
  code: Yup.string()
    .required('Code is required')
    .max(50, 'Too Long!'),
  description: Yup.string()
    .nullable()
    .max(255, 'Too Long!'),
  is_active: Yup.boolean(),
  is_deduction: Yup.boolean()
});

const AddCostTypeModal = ({ open, handleClose }) => {
  const createCostType = useCreateCostType();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Cost Type</DialogTitle>
      <Formik
        initialValues={{
          name: '',
          code: '',
          description: '',
          is_active: true,
          is_deduction: false
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createCostType.mutateAsync(values);
            resetForm();
            handleClose();
          } catch (error) {
            console.error('Error creating cost type:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                name="name"
                label="Name"
                fullWidth
                margin="normal"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
              />

              <Field
                as={TextField}
                name="code"
                label="Code"
                fullWidth
                margin="normal"
                error={touched.code && errors.code}
                helperText={touched.code && errors.code}
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

              <FormControlLabel
                control={
                  <Switch
                    checked={values.is_active}
                    onChange={(e) => setFieldValue('is_active', e.target.checked)}
                    color="primary"
                  />
                }
                label="Active"
                sx={{ mt: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.is_deduction}
                    onChange={(e) => setFieldValue('is_deduction', e.target.checked)}
                    color="primary"
                  />
                }
                label="Is Deduction"
                sx={{ mt: 1 }}
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
                {isSubmitting ? 'Adding...' : 'Add Cost Type'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddCostTypeModal;
