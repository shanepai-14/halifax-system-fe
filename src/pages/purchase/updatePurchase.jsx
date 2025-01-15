import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  ArrowBackOutlined,
  FileDownloadOutlined,
  UploadOutlined,
  CancelOutlined,
  Save,
} from "@mui/icons-material";
import {
  usePurchaseOrder,
  useUpdatePurchaseOrder,
  useUploadAttachment,
  useUpdatePurchaseOrderStatus,
} from "@/hooks/usePurchaseOrders";
import {
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import PrintIcon from "@mui/icons-material/Print";
import { getFileUrl } from "@/utils/fileHelper";
import { toast } from "sonner";
import PrintablePO from "./PrintablePO";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import {
  selectAttributes,
  selectCostTypes,
  selectProducts,
} from "@/store/slices/productsSlice";
import AddCostTypeModal from "../product/AddCostTypeModal";
import PurchaseOrderReceivedItems from "./PurchaseOrderReceivedItems";
import MultipleFileUploader from './MultipleFileUploader';

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
  { label: "Cancelled", value: "cancelled" }, // Add cancelled status
];

const UpdatePurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    items: [],
    invoice: "",
    additional_costs: [],
    received_items: [],
  });

  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const products = useSelector(selectProducts);
  const attributes = useSelector(selectAttributes);
  const costTypes = useSelector(selectCostTypes);
  const [openCostTypeModal, setOpenCostTypeModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Queries and Mutations
  const { data: purchaseOrder, isLoading, refetch } = usePurchaseOrder(id);
  const updatePOMutation = useUpdatePurchaseOrder();
  const updateStatus = useUpdatePurchaseOrderStatus();
  const uploadAttachmentMutation = useUploadAttachment();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFilesChange = (files, action = 'append') => {
    if (action === 'append') {
      setUploadedFiles(prevFiles => {
        // Filter out any duplicates before appending
        const newFiles = files.filter(newFile => 
          !prevFiles.some(prevFile => prevFile.id === newFile.id)
        );
        return [...prevFiles, ...newFiles];
      });
    } else {
      setUploadedFiles(files);
    }
  };

  useEffect(() => {
    if (purchaseOrder) {
      // Set form data
      setFormData({
        ...purchaseOrder,
        items: purchaseOrder.items.map((item) => ({
          ...item,
          received_quantity: item.received_quantity || 0,
        })),
        received_items: purchaseOrder.status === 'partially_received' && purchaseOrder.received_items?.length === 0
        ? [
            {
              product_id: '',
              attribute_id: '',
              received_quantity: 0,
              cost_price: 0,
              walk_in_price: 0,
              term_price: 0,
              wholesale_price: 0,
              regular_price: 0,
              remarks: '',
            }
          ]
        : purchaseOrder.received_items || []
      });

      if (purchaseOrder?.attachments) {
        const transformedFiles = purchaseOrder.attachments.map(attachment => ({
          id: attachment.id,
          file_size: attachment.file_size,
          file_name: attachment.file_name,
          file_path: attachment.file_path,
          file_type: attachment.file_type
        }));
        setUploadedFiles(transformedFiles);
      }
    
  
      // Set active step
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

  const handleAddCost = () => {
    setFormData((prev) => ({
      ...prev,
      additional_costs: [
        ...prev.additional_costs,
        { cost_type_id: "", amount: "", remarks: "" },
      ],
    }));
  };

  const handleCostChange = (index, field, value) => {
    if (field === "cost_type_id" && value) {
      const isDuplicate = formData.additional_costs.some(
        (cost, i) => i !== index && cost.cost_type_id === value
      );

      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          [`additional_costs.${index}.cost_type_id`]:
            "This cost type is already added",
        }));
        return;
      }
    }

    const updatedCosts = [...formData.additional_costs];
    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, additional_costs: updatedCosts }));

    if (errors[`additional_costs.${index}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`additional_costs.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const removeCost = (index) => {
    const updatedCosts = formData.additional_costs.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({ ...prev, additional_costs: updatedCosts }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: "",
          attribute_id: "",
          requested_quantity: 1,
          price: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: updatedItems }));

      // Clear any errors for the removed item
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`items.${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  // Add this function for saving PO details
  const handleSave = async () => {
    const newErrors = {};

    // Validate items if status is pending
    if (isPending) {
      formData.items.forEach((item, index) => {
        if (!item.product_id) {
          newErrors[`items.${index}.product_id`] = "Product is required";
        }
        if (!item.attribute_id) {
          newErrors[`items.${index}.attribute_id`] = "Measurement is required";
        }
        if (!item.requested_quantity || item.requested_quantity <= 0) {
          newErrors[`items.${index}.requested_quantity`] =
            "Quantity must be greater than 0";
        }
        if (!item.price || item.price <= 0) {
          newErrors[`items.${index}.price`] = "Price must be greater than 0";
        }
      });
    }

    if (isPartiallyReceived) {
        formData.received_items.forEach((item, index) => {
          if (!item.product_id) {
            newErrors[`received_items.${index}.product_id`] =
              "Product is required";
          }

          if (!item.received_quantity || Number(item.received_quantity) <= 0) {
            newErrors[`received_items.${index}.received_quantity`] =
              "Received quantity must be greater than 0";
          }

          // Validate all price fields
          const priceFields = {
            cost_price: "Cost price",
            walk_in_price: "Walk-in price",
            wholesale_price: "Wholesale price",
            regular_price: "Regular price",
          };

          Object.entries(priceFields).forEach(([field, label]) => {
            if (!item[field] || Number(item[field]) <= 0) {
              newErrors[
                `received_items.${index}.${field}`
              ] = `${label} must be greater than 0`;
            }
          });
        });
      
    }

    // Validate additional costs
    formData.additional_costs.forEach((cost, index) => {
      if (!cost.cost_type_id) {
        newErrors[`additional_costs.${index}.cost_type_id`] =
          "Cost type is required";
      }
      if (!cost.amount || Number(cost.amount) <= 0) {
        newErrors[`additional_costs.${index}.amount`] =
          "Amount must be greater than 0";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log(newErrors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSaving(true);
      await updatePOMutation.mutateAsync({
        id,
        data: formData,
      });
      toast.success("Purchase Order updated successfully");
      refetch();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error("Something went wrong please try again");
    } finally {
      setIsSaving(false);
    }
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

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.price * item.requested_quantity,
      0
    );
  };

  const calculateRequestedTotalWithCosts = () => {
    const itemsTotal = formData.items.reduce(
      (sum, item) => sum + item.price * item.requested_quantity,
      0
    );
    const costsTotal = formData.additional_costs.reduce(
      (sum, cost) => sum + (Number(cost.amount) || 0),
      0
    );
    return itemsTotal + costsTotal;
  };

  const calculateTotalCosts= () => {

    const costsTotal = formData.additional_costs.reduce(
      (sum, cost) => sum + (Number(cost.amount) || 0),
      0
    );
    return costsTotal;
  };
  
  

  const calculateReceivedTotalWithCosts = () => {
    const itemsTotal = formData.received_items.reduce(
      (sum, item) => sum + item.cost_price * item.received_quantity,
      0
    );
    const costsTotal = formData.additional_costs.reduce(
      (sum, cost) => sum + (Number(cost.amount) || 0),
      0
    );
    return itemsTotal + costsTotal;
  };

  const handleConfirmStatusUpdate = async () => {
    setErrors({});
    let hasErrors = false;
    const newErrors = {};

    if (isPending) {
      formData.items.forEach((item, index) => {
        if (!item.product_id) {
          newErrors[`items.${index}.product_id`] = "Product is required";
          hasErrors = true;
        }
        if (!item.attribute_id) {
          newErrors[`items.${index}.attribute_id`] = "Measurement is required";
          hasErrors = true;
        }
        if (!item.requested_quantity || item.requested_quantity <= 0) {
          newErrors[`items.${index}.requested_quantity`] =
            "Quantity must be greater than 0";
            hasErrors = true;
        }
        if (!item.price || item.price <= 0) {
          newErrors[`items.${index}.price`] = "Price must be greater than 0";
          hasErrors = true;
        }
      });
    }

    formData.received_items.forEach((item, index) => {
      console.log(item, index);
      if (!item.product_id) {
        newErrors[`received_items.${index}.product_id`] = "Product is required";
        hasErrors = true;
      }

      // Received quantity validation
      if (!item.received_quantity || Number(item.received_quantity) <= 0) {
        newErrors[`received_items.${index}.received_quantity`] = "Received quantity must be greater than 0";
        hasErrors = true;
      }

      // Validate all price fields
      const priceFields = {
        cost_price: "Cost price",
        walk_in_price: "Walk-in price",
        wholesale_price: "Wholesale price",
        regular_price: "Regular price"
      };

      Object.entries(priceFields).forEach(([field, label]) => {
        if (!item[field] || Number(item[field]) <= 0) {
          newErrors[`received_items.${index}.${field}`] = `${label} must be greater than 0`;
          hasErrors = true;
        }
      });
    });

    formData.additional_costs.forEach((cost, index) => {
      if (!cost.cost_type_id) {
        newErrors[`additional_costs.${index}.cost_type_id`] = "Cost type is required";
        hasErrors = true;
      }
      if (!cost.amount || Number(cost.amount) <= 0) {
        newErrors[`additional_costs.${index}.amount`] = "Amount must be greater than 0";
        hasErrors = true;
      }
    });
  
    if (hasErrors) {
      setErrors(newErrors);
      setDialogOpen(false);
      toast.error("Please fill in all required fields correctly");
      return;
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
      setIsUpdating(false);
      setDialogOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    if (field === "product_id" && value) {
      // Check for duplicate product
      const isDuplicate = formData.items.some(
        (item, i) => i !== index && item.product_id === value
      );

      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          [`items.${index}.product_id`]: "This product is already added",
        }));
        return;
      }
    }

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));

    // Clear error for this field if it exists
    if (errors[`items.${index}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`items.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const handleReceivedItemChange = (index, field, value) => {
    const updatedItems = [...formData.received_items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      received_items: updatedItems,
    }));

    if (errors[`received_items.${index}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`received_items.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const handleReceivedAddItem = () => {
    const newItem = {
      product_id: "",
      attribute_id: "",
      received_quantity: 0,
      cost_price: 0,
      walk_in_price: 0,
      term_price: 0,
      wholesale_price: 0,
      regular_price: 0,
      remarks: "",
    };

    setFormData((prev) => ({
      ...prev,
      received_items: [...prev.received_items, newItem],
    }));
  };

  const handleReceivedRemoveItem = (index) => {
    if (formData.received_items.length > 1) {
      const updatedItems = formData.received_items.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        received_items: updatedItems,
      }));

      // Clear any errors for the removed item
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`received_items.${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const isPending = formData.status === "pending";
  const isPartiallyReceived = formData.status === "partially_received";
  const isCompleted = formData.status === "completed";
  const isCancelled = formData.status === "cancelled";

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

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this purchase order? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsUpdating(true);
          await updateStatus.mutateAsync({
            id,
            status: "cancelled",
         
          });

          Swal.fire(
            "Cancelled!",
            "The purchase order has been cancelled.",
            "success"
          );
          refetch();
        } catch (error) {
          Swal.fire("Error!", "Failed to cancel the purchase order.", "error");
        } finally {
          setIsUpdating(false);
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "partially_received":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
  {steps.map((step, index) => (
    <Step key={step.value}>
      <StepLabel
        sx={{
          '& .MuiStepLabel-label': {
            color: activeStep === 3 && step.value === 'cancelled' ? 'error.main' : (
              index === steps.length - 1 ? 'grey.400' : 'primary.primary'
            )
          },
          '& .MuiStepIcon-root': {
            color: activeStep === 3 && step.value === 'cancelled' ? 'error.main' : (
              index === steps.length - 1 ? 'grey.400' : 'primary.primary'
            )
          },
        }}
      >
        {step.label}
      </StepLabel>
    </Step>
  ))}
</Stepper>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <IconButton
            onClick={() => navigate("/app/purchase")}
            sx={{ mb: 2 }}
            color="primary"
          >
            <ArrowBackOutlined />
          </IconButton>
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}
          >
          <Tooltip title="Save Purchase Order">
            <IconButton
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving || (!isPending && !isPartiallyReceived)}
            >
              {isSaving ? <Box><CircularProgress size="30px"/></Box> : <Save />}
            </IconButton>
            </Tooltip>
            <Tooltip title="Print Purchase Order">
              <IconButton onClick={handlePrint} color="primary">
                <PrintIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <PrintablePO purchaseOrder={purchaseOrder} contentRef={contentRef} />
        </Box>

        <Paper elevation={0} sx={{ p: 0, mb: 3 }}>
  <Grid container spacing={3} alignItems="flex-start">
    {/* Left Column */}
    <Grid item xs={12} md={8}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Purchase Order: {purchaseOrder?.po_number}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Supplier: {purchaseOrder?.supplier?.supplier_name}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        PO Date: {new Date(purchaseOrder?.po_date).toLocaleDateString()}
      </Typography>
      {(isPartiallyReceived || isCompleted || isCancelled) && (
          <Paper elevation={0} sx={{ p: 0, mb: 3 }}>
                {!isCompleted && !isCancelled ? (
                  <TextField
                    
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
                    disabled={isCompleted}
                    sx={{ mb: 2 ,width : 300}}
                  />
                ) : (
                  <Typography>
                    Invoice Number: {formData.invoice || ""}
                  </Typography>
                )}
              {/* <Grid item xs={12} md={6}>
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
              </Grid> */}

          </Paper>
        )}
    </Grid>

    {/* Right Column */}
    <Grid item xs={12} md={4}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <MultipleFileUploader
          referenceNumber={id}
          uploadedFiles={uploadedFiles}
          onFilesChange={handleFilesChange}
          modelType="purchase-orders"
        />
      </Box>
    </Grid>
  </Grid>
</Paper>


      
        <Paper elevation={0} sx={{ p: 0 }}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                <TableRow >
                <TableCell colSpan={ isPending ? 6 : 5}>
                  <Typography variant="h5">Requested Items</Typography>
                </TableCell>
              </TableRow>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Measurement</TableCell>
                    <TableCell>Request Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    {isPending && <TableCell width={50} />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        {isPending  ? (
                          <Autocomplete
                            size="small"
                            sx={{ width: 300 }}
                            value={
                              products?.find(
                                (product) => product.id === item.product_id
                              ) || null
                            }
                            onChange={(e, newValue) =>
                              handleItemChange(
                                index,
                                "product_id",
                                newValue ? newValue.id : ""
                              )
                            }
                            options={
                              products?.filter(
                                (product) =>
                                  !formData.items.some(
                                    (item, i) =>
                                      i !== index &&
                                      item.product_id === product.id
                                  )
                              ) || []
                            }
                            getOptionLabel={(option) =>
                              option.product_name || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                sx={{
                                  "& .MuiInputBase-root": {
                                    padding: "4px 8px",
                                  },
                                  "& .MuiFormLabel-root": {
                                    fontSize: "0.875rem",
                                  },
                                }}
                                error={!!errors[`items.${index}.product_id`]}
                                helperText={
                                  errors[`items.${index}.product_id`] ||
                                  "Required"
                                }
                              />
                            )}
                          />
                        ) : (
                          item.product?.product_name
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        {isPending ? (
                          <Autocomplete
                            size="small"
                            sx={{ width: 300 }}
                            value={
                              attributes?.find(
                                (attribute) =>
                                  attribute.id === item.attribute_id
                              ) || null
                            }
                            onChange={(e, newValue) =>
                              handleItemChange(
                                index,
                                "attribute_id",
                                newValue ? newValue.id : ""
                              )
                            }
                            options={
                              attributes?.filter(
                                (attribute) =>
                                  !formData.items.some(
                                    (item, i) =>
                                      i !== index &&
                                      item.attribute_id === attribute.id
                                  )
                              ) || []
                            }
                            getOptionLabel={(option) =>
                              `${option.attribute_name} (${option.unit_of_measurement})` ||
                              ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.id === value
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                sx={{
                                  "& .MuiInputBase-root": {
                                    padding: "4px 8px",
                                  },
                                  "& .MuiFormLabel-root": {
                                    fontSize: "0.875rem",
                                  },
                                }}
                                error={!!errors[`items.${index}.attribute_id`]}
                                helperText={
                                  errors[`items.${index}.attribute_id`] ||
                                  "Required"
                                }
                              />
                            )}
                          />
                        ) : (
                          `${item.attribute?.attribute_name} (${item.attribute?.unit_of_measurement})`
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        {isPending ? (
                          <TextField
                            type="number"
                            value={item.requested_quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "requested_quantity",
                                e.target.value
                              )
                            }
                            error={
                              !!errors[`items.${index}.requested_quantity`]
                            }
                            helperText={
                              errors[`items.${index}.requested_quantity`] ||
                              "Required"
                            }
                            inputProps={{ min: 1 }}
                            disabled={!isPending}
                            size="small"
                          />
                        ) : (
                          item.requested_quantity
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        {isPending ? (
                          <TextField
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(index, "price", e.target.value)
                            }
                            error={!!errors[`items.${index}.price`]}
                            helperText={
                              errors[`items.${index}.price`] || "Required"
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            disabled={!isPending}
                            size="small"
                          />
                        ) : (
                          `₱${item.price}`
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        ₱{(item.price * item.requested_quantity).toFixed(2)}
                      </TableCell>
                      {isPending && (
                        <TableCell sx={{ verticalAlign: "top" }}>
                          <IconButton
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Button
                        sx={{ visibility: isPending ? "visible" : "hidden" }}
                        startIcon={<PlusOutlined />}
                        onClick={addItem}
                      >
                        Add Item
                      </Button>
                    </TableCell>
                    <TableCell  verticalAlign="left">
                      <Typography variant="h5" textAlign="left">Total Requested: </Typography>
                    </TableCell>
                    <TableCell >
                    <Typography variant="h5" >
                    ₱{calculateTotal().toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
            ></Box>
            {!isPending && (
              <PurchaseOrderReceivedItems
                products={products}
                attributes={attributes}
                receivedItems={formData.received_items}
                onItemChange={handleReceivedItemChange}
                onAddItem={handleReceivedAddItem}
                onRemoveItem={handleReceivedRemoveItem}
                errors={errors}
                disabled={isCompleted}
                status={formData.status}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={isCompleted || isCancelled  ? 3 : 4}>
                      {" "}
                      <Typography variant="h5" sx={{ mt: 4, mb: 1 }} >
                        Additional Costs
                        <IconButton
                          sx={{ marginLeft: "0px !important" }}
                          onClick={() => setOpenCostTypeModal(true)}
                        >
                          <PlusOutlined />
                        </IconButton>
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cost Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Remarks</TableCell>
                    {!isCompleted && !isCancelled  && <TableCell width={50} />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.additional_costs.map((cost, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {!isCompleted && !isCancelled ? (
                          <Autocomplete
                            size="small"
                            value={
                              costTypes?.find(
                                (type) =>
                                  type.cost_type_id === cost.cost_type_id
                              ) || null
                            }
                            onChange={(e, newValue) =>
                              handleCostChange(
                                index,
                                "cost_type_id",
                                newValue ? newValue.cost_type_id : ""
                              )
                            }
                            options={
                              costTypes?.filter(
                                (type) =>
                                  type.is_active &&
                                  !formData.additional_costs.some(
                                    (c, i) =>
                                      i !== index &&
                                      c.cost_type_id === type.cost_type_id
                                  )
                              ) || []
                            }
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option.cost_type_id === value
                            }
                            disabled={!isPending && !isPartiallyReceived}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                sx={{
                                  "& .MuiInputBase-root": {
                                    padding: "4px 8px",
                                  },
                                  "& .MuiFormLabel-root": {
                                    fontSize: "0.875rem",
                                  },
                                }}
                                error={
                                  !!errors[
                                    `additional_costs.${index}.cost_type_id`
                                  ]
                                }
                                helperText={
                                  errors[
                                    `additional_costs.${index}.cost_type_id`
                                  ] || "Required"
                                }
                              />
                            )}
                          />
                        ) : (
                          costTypes?.find(
                            (type) => type.cost_type_id === cost.cost_type_id
                          )?.name || ""
                        )}
                      </TableCell>
                      <TableCell>
                        {!isCompleted && !isCancelled  ? (
                          <TextField
                            size="small"
                            type="number"
                            value={cost.amount}
                            onChange={(e) =>
                              handleCostChange(index, "amount", e.target.value)
                            }
                            error={!!errors[`additional_costs.${index}.amount`]}
                            helperText={
                              errors[`additional_costs.${index}.amount`] ||
                              "Required"
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            disabled={!isPending && !isPartiallyReceived}
                          />
                        ) : (
                          cost.amount
                        )}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        {!isCompleted && !isCancelled  ? (
                          <TextField
                            size="small"
                            value={cost.remarks || ""}
                            onChange={(e) =>
                              handleCostChange(index, "remarks", e.target.value)
                            }
                            fullWidth
                            disabled={!isPending && !isPartiallyReceived}
                          />
                        ) : (
                          cost.remarks || ""
                        )}
                      </TableCell>
                      {!isCompleted && !isCancelled  && (
                        <TableCell sx={{verticalAlign:"top"}}>
                          <IconButton
                            size="large"
                            onClick={() => removeCost(index)}
                            disabled={!isPending && !isPartiallyReceived}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  <TableRow>
                  <TableCell  sx={{border:"none"}} colSpan={ !isCompleted && !isCancelled  ? 2 : 1}>
                      <Button
                        startIcon={<PlusOutlined />}
                        onClick={handleAddCost}
                        sx={{ visibility: !isCompleted && !isCancelled ? "visible" : "hidden" }}
                      >
                        Add Additional Cost
                      </Button>
                    </TableCell >

                    <TableCell >
                      <Typography variant="h5" textAlign="right">
                        Total Cost:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">
                        ₱{calculateTotalCosts().toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{border:"none"}} colSpan={ !isCompleted && !isCancelled ? 2 : 1}>

                    </TableCell>
                
                    <TableCell  sx={{ verticalAlign: "right" }}>
                      <Typography variant="h5" textAlign="right">
                        Total Requested with Costs:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">
                        ₱{calculateRequestedTotalWithCosts().toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{border:"none"}} colSpan={ !isCompleted && !isCancelled ? 2 : 1}>

                    </TableCell>
                    <TableCell sx={{ verticalAlign: "right" }} >
                      <Typography variant="h5" textAlign="right">
                        Total Received with Costs:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">
                        ₱{calculateReceivedTotalWithCosts().toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>



          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                mt: 4,
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              {isPartiallyReceived && (
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  color="error"
                  startIcon={<CancelOutlined />}
                  sx={{ minWidth: 200 }}
                >
                  Cancel Order
                </Button>
              )}
              {(isPending || isPartiallyReceived) && !isUpdating && (
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
      <AddCostTypeModal
        open={openCostTypeModal}
        handleClose={() => setOpenCostTypeModal(false)}
      />
    </Container>
  );
};

export default UpdatePurchaseOrder;
