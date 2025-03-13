import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Formik, Form, Field, FieldArray } from "formik";
import { toast } from 'sonner'
import * as Yup from "yup";
import {
  useCreateProduct,
  useAttributes,
  useUploadProductImage,
  useProducts
} from "@/hooks/useProducts";

const validationSchema = Yup.object().shape({
  product_name: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  product_category_id: Yup.number().required("Required"),
  reorder_level: Yup.number()
    .min(0, "Must be 0 or greater")
    .required("Required"),
  product_type: Yup.string()
    .oneOf(["raw", "finished", "custom"], "Invalid product type")
    .required("Required"),
  product_image: Yup.mixed().nullable().test(
    "fileSize",
    "File is too large",
    (value) => !value || value.size <= 5000000
  ), // 5MB limit
  attributes: Yup.array().of(
    Yup.object().shape({
      attribute_id: Yup.number().required("Required"),
      value: Yup.number().required("Required"),
    })
  ),
});

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

const AddProductModal = ({ open, handleClose, categories }) => {
  const createProduct = useCreateProduct();
  const uploadImage = useUploadProductImage();
  const { data: attributes = [] } = useAttributes();
  const [imagePreview, setImagePreview] = useState(null);
  const { refetch: refetchProducts } = useProducts();
  
  const handleImageChange = (file, setFieldValue) => {
    if (file) {
      setFieldValue("product_image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCloseModal = () => { 
    handleClose();
    setImagePreview(null);
  }


  const isAttributeSelected = (attributeId, currentIndex, attributes) => {
    return attributes.some(
      (attr, idx) => attr.attribute_id === attributeId && idx !== currentIndex
    );
  };


  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <Formik
        initialValues={{
          product_name: "",
          product_category_id: "",
          reorder_level: 0,
          product_type: "raw",
          product_image: null,
          attributes: [],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const product = await createProduct.mutateAsync(values);

            if (values.product_image) {
              await uploadImage.mutateAsync({
                id: product.data.id,
                image: values.product_image,
              });
            }
            refetchProducts();
            setImagePreview(null);
            resetForm();
            handleCloseModal();
            toast.success('Successfully Created Product')
          } catch (error) {
            toast.error('Something went wrong please try again')
            console.error("Error creating product:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <DialogContent>
              <Box sx={{ maxWidth: 500, mx: "auto", mt: 2, mb: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderStyle: "dashed",
                    borderColor: "grey.400",
                    backgroundColor: "grey.50",
                    "&:hover": {
                      borderColor: "primary.main",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <FileUploader
                      handleChange={(file) =>
                        handleImageChange(file, setFieldValue)
                      }
                      name="product_image"
                      label="Upload or drop a Product Image"
                      types={fileTypes}
                      multiple={false}
                    />
                    {touched.product_image && errors.product_image && (
                      <Typography
                        color="error"
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        {errors.product_image}
                      </Typography>
                    )}

                    {imagePreview && (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          mt: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: "grey.50",
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: 200,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                            borderRadius: 1,
                            bgcolor: "white",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </Paper>
              </Box>
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
                error={
                  touched.product_category_id && errors.product_category_id
                }
                helperText={
                  touched.product_category_id && errors.product_category_id
                }
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
                      <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
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
                            <MenuItem key={attr.id}
                            disabled={isAttributeSelected(
                              attr.id,
                              index,
                              values.attributes
                            )}
                            value={attr.id}>
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
                        <IconButton onClick={() => remove(index)} color="error">
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      type="button"
                      onClick={() => push({ attribute_id: "", value: "" })}
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
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddProductModal;
