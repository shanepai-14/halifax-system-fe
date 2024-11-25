import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCreateAttribute } from '@/hooks/useProducts';

const validationSchema = Yup.object().shape({
  attribute_name: Yup.string()
    .required('Required')
    .min(2, 'Too Short!')
    .max(100, 'Too Long!'),
  unit_of_measurement: Yup.string()
    .required('Required')
    .max(50, 'Too Long!')
});

const AddAttributeModal = ({ open, handleClose }) => {
  const createAttribute = useCreateAttribute();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Attribute</DialogTitle>
      <Formik
        initialValues={{
          attribute_name: '',
          unit_of_measurement: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await createAttribute.mutateAsync(values);
            resetForm();
            handleClose();
          } catch (error) {
            console.error('Error creating attribute:', error);
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
                name="attribute_name"
                label="Attribute Name"
                fullWidth
                margin="normal"
                error={touched.attribute_name && errors.attribute_name}
                helperText={touched.attribute_name && errors.attribute_name}
              />
              <Field
                as={TextField}
                name="unit_of_measurement"
                label="Unit of Measurement"
                fullWidth
                margin="normal"
                error={touched.unit_of_measurement && errors.unit_of_measurement}
                helperText={touched.unit_of_measurement && errors.unit_of_measurement}
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
                {isSubmitting ? 'Adding...' : 'Add Attribute'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddAttributeModal;