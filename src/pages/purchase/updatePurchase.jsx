import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Skeleton,
  Link,
  Alert,
  CircularProgress 
} from "@mui/material";
import {
  ArrowBackOutlined,
  FileDownloadOutlined,
  UploadOutlined,
} from "@mui/icons-material";
import {
  usePurchaseOrder,
  useUpdatePurchaseOrder,
  useUploadAttachment,
} from "@/hooks/usePurchaseOrders";
import { getFileUrl } from "@/utils/fileHelper";
import { toast } from "sonner";
const LoadingSkeleton = () => (
  <Box>
    <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={60} sx={{ mb: 4 }} />
    <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2 }} />
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", mb: 2 }} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
    </Grid>
  </Box>
);

const steps = [
  { label: "Pending", value: "pending" },
  { label: "Partially Received", value: "partially_received" },
  { label: "Completed", value: "completed" },
];

const UpdatePurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    items: [],
    invoice: "",
    attachment: "",
  });
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Queries and Mutations
  const { data: purchaseOrder, isLoading, refetch } = usePurchaseOrder(id);
  const updatePOMutation = useUpdatePurchaseOrder();
  const uploadAttachmentMutation = useUploadAttachment();

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        ...purchaseOrder,
        items: purchaseOrder.items.map((item) => ({
          ...item,
          received_quantity: item.received_quantity || 0,
        })),
      });

      const statusIndex = steps.findIndex(
        (step) => step.value === purchaseOrder.status
      );
      setActiveStep(statusIndex);
    }
  }, [purchaseOrder]);

  const handleDownload = (e) => {
    e.preventDefault();
    const a = document.createElement("a");
    a.href = getFileUrl(formData.attachment);
    a.download = formData.attachment.split("/").pop();
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleStatusUpdate = () => {
    let newStatus = "";
    if (formData.status === "pending") {
      newStatus = "partially_received";
    } else if (formData.status === "partially_received") {
      newStatus = "completed";
    }
    setNextStatus(newStatus);
    setDialogOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    setErrors({});
    let hasErrors = false;
    const newErrors = {};

    if (nextStatus === "completed") {
      // Check required fields
      if (!formData.invoice) {
        newErrors.invoice = "Invoice is required";
        hasErrors = true;
      }
      if (!formData.attachment) {
        newErrors.attachment = "Attachment is required";
        hasErrors = true;
      }

      // Check items array for received_quantity and retail_price
      formData.items.forEach((item, index) => {
        // Check received_quantity
        if (!item.received_quantity || item.received_quantity <= 0) {
          newErrors[`items.${index}.received_quantity`] =
            "Received quantity is required";
          hasErrors = true;
        } else if (item.received_quantity > item.requested_quantity) {
          newErrors[`items.${index}.received_quantity`] =
            "Cannot exceed requested quantity";
          hasErrors = true;
        }

        // Check retail_price
        if (!item.retail_price || item.retail_price <= 0) {
          newErrors[`items.${index}.retail_price`] = "Retail price is required";
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setErrors(newErrors);
        setDialogOpen(false);
        return;
      }
    }

    try {
        setIsUpdating(true);
      await updatePOMutation.mutateAsync({
        id,
        data: {
          ...formData,
          status: nextStatus,
        },
      });

      if (formData.attachment instanceof File) {
        await uploadAttachmentMutation.mutateAsync({
          id,
          file: formData.attachment,
        });
      }

      setDialogOpen(false);
      toast.success("Purchase Order updated successfully");
      refetch();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error("Something went wrong please try again");
      }
      setIsUpdating(false)
      setDialogOpen(false);
    } finally {
        setIsUpdating(false);
      }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const isPending = formData.status === "pending";
  const isPartiallyReceived = formData.status === "partially_received";
  const isCompleted = formData.status === "completed";

  const getStatusUpdateButtonText = () => {
    if (isPending) return "Mark as Partially Received";
    if (isPartiallyReceived) return "Mark as Completed";
    return "";
  };

  const getConfirmationMessage = () => {
    if (nextStatus === "partially_received") {
      return "Are you sure you want to mark this Purchase Order as partially received? This will allow you to start recording received quantities.";
    }
    if (nextStatus === "completed") {
      return "Are you sure you want to mark this Purchase Order as completed? This action cannot be undone.";
    }
    return "";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "partially_received":
        return "info";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton
          onClick={() => navigate("/app/purchase")}
          sx={{ mb: 2 }}
          color="primary"
        >
          <ArrowBackOutlined />
        </IconButton>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.value}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={0} sx={{ p: 0, mb: 0 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Purchase Order: {purchaseOrder?.po_number}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Alert
                  severity={getStatusColor(formData.status)}
                  sx={{ mb: 2 }}
                >
                  Current Status:{" "}
                  {steps.find((s) => s.value === formData.status)?.label}
                </Alert>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: 0, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Supplier: {purchaseOrder?.supplier?.supplier_name}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography variant="subtitle1">
                PO Date: {new Date(purchaseOrder?.po_date).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {(isPartiallyReceived || isCompleted) && (
          <Paper elevation={0} sx={{ p: 0, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  name="invoice"
                  value={formData.invoice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      invoice: e.target.value,
                    }))
                  }
                  error={!!errors.invoice}
                  helperText={errors.invoice}
                  required
                  disabled={isCompleted}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {formData.attachment &&
                typeof formData.attachment === "string" ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography>Current Attachment:</Typography>
                    <Link
                      href="#"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      onClick={handleDownload}
                    >
                      <FileDownloadOutlined /> Download Attachment
                    </Link>
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    type="file"
                    label="Attachment"
                    name="attachment"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
                    }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Allowed file types
                        const allowedTypes = [
                          "application/pdf",
                          "application/msword",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          "image/png",
                          "image/jpeg",
                        ];

                        // Check file type
                        if (!allowedTypes.includes(file.type)) {
                          setErrors((prev) => ({
                            ...prev,
                            attachment:
                              "File must be PDF, DOC, DOCX, PNG, or JPG format",
                          }));
                          e.target.value = ""; // Clear the input
                          return;
                        }

                        // Optional: Check file size (e.g., 5MB limit)
                        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                        if (file.size > maxSize) {
                          setErrors((prev) => ({
                            ...prev,
                            attachment: "File size must be less than 5MB",
                          }));
                          e.target.value = ""; // Clear the input
                          return;
                        }

                        // If validation passes, update form data
                        setFormData((prev) => ({
                          ...prev,
                          attachment: file,
                        }));
                      }
                    }}
                    error={!!errors.attachment}
                    helperText={errors.attachment}
                    disabled={isCompleted}
                    required
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        )}

        <Paper elevation={0} sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Requested Quantity</TableCell>
                  {(isPartiallyReceived || isCompleted) && (
                    <>
                      <TableCell>Received Quantity</TableCell>
                      <TableCell>Retail Price</TableCell>
                    </>
                  )}
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      {item.product?.product_name}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <TextField
                        sx={{ width: 215 }}
                        type="number"
                        value={item.requested_quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "requested_quantity",
                            e.target.value
                          )
                        }
                        disabled={!isPending}
                        size="small"
                        inputProps={{ min: 1 }}
                      />
                    </TableCell>
                    {(isPartiallyReceived || isCompleted) && (
                      <>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <TextField
                            sx={{ width: 215 }}
                            type="number"
                            value={item.received_quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "received_quantity",
                                e.target.value
                              )
                            }
                            disabled={isCompleted}
                            size="small"
                            required
                            error={!!errors[`items.${index}.received_quantity`]}
                            helperText={
                              errors[`items.${index}.received_quantity`]
                            }
                            inputProps={{
                              min: 0,
                              max: item.requested_quantity,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <TextField
                            sx={{ width: 215 }}
                            type="number"
                            value={item.retail_price}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "retail_price",
                                e.target.value
                              )
                            }
                            error={!!errors[`items.${index}.retail_price`]}
                            disabled={isCompleted}
                            size="small"
                            required
                            helperText={errors[`items.${index}.retail_price`]}
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </TableCell>
                      </>
                    )}
                    <TableCell sx={{ verticalAlign: "top" }}>
                      ₱{item.price}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      ₱
                      {(
                        item.price *
                        (isPartiallyReceived || isCompleted
                          ? item.received_quantity || 0
                          : item.requested_quantity)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", mt: 4, justifyContent: "flex-end" }}>
              {(isPending || isPartiallyReceived) && (
                <Button
                  variant="contained"
                  onClick={handleStatusUpdate}
                  disabled={updatePOMutation.isPending}
                  color="primary"
                  sx={{ minWidth: 200 }}
                >
                  {getStatusUpdateButtonText()}
                </Button>
              )}
            </Box>
          </Grid>
        </Paper>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: "500px",
            padding: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#333",
            pb: 1,
          }}
        >
          Confirm Status Update
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText
            sx={{
              fontSize: "1.1rem",
              color: "#555",
              lineHeight: 1.5,
            }}
          >
            {getConfirmationMessage()}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: 3,
            paddingTop: 2,
            gap: 2,
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              fontSize: "1rem",
              minWidth: "100px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmStatusUpdate}
            variant="contained"
            color="primary"
            disabled={isUpdating}
            sx={{
              fontSize: "1rem",
              minWidth: "100px",
              textTransform: "none",
              boxShadow: 2,
            }}
          >
            {isUpdating ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                <span>Updating...</span>
              </Box>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdatePurchaseOrder;
